"""
mode_classifier.py
==================
Kerala Mobility Platform — ML Service
--------------------------------------
Transport mode classification for GPS trip legs.

Pipeline
--------
1. extract_features(pings)
   Given a list of consecutive GPS pings for a single trip leg, returns
   a feature dict with:
     - avg_speed_kmh         : arithmetic mean of instantaneous speeds
     - max_speed_kmh         : maximum instantaneous speed
     - p90_speed_kmh         : 90th-percentile instantaneous speed
     - heading_variance      : circular variance of consecutive bearings (0–1)
     - speed_variance        : variance of speed samples (km²/h²)
     - stop_ratio            : fraction of time speed < 3 km/h (idling/stops)

2. classify_mode_heuristic(features)
   Fast rule-based fallback. Uses domain thresholds derived from Kerala
   transport characteristics. Always returns a valid label — never fails.

3. classify_mode_rf(features, classifier)
   Lightweight scikit-learn RandomForestClassifier that takes the extracted
   feature vector and returns one of four labels with confidence scores.

4. classify_mode(pings, classifier=None)
   Top-level convenience function:
     - Extracts features from pings.
     - If `classifier` is supplied and valid, runs RF inference.
     - Falls back to heuristic if RF is None or confidence is low (<55%).
   Returns a ModeResult dataclass.

Travel Mode Labels
------------------
  WALK         : pedestrian, cycling (< ~8 km/h sustained)
  TWO_WHEELER  : motorbike / e-scooter (8–45 km/h, high heading variance)
  BUS_CAR      : bus, auto-rickshaw, private car, taxi (15–90 km/h)
  TRAIN_METRO  : rail, Kochi Metro, long-distance express (> 60 km/h,
                 very low heading variance due to fixed track)

Synthetic Pre-training
----------------------
Since labeled Kerala GPS trip data does not yet exist in the repo,
the module ships a synthetic data generator that creates realistic
training samples from domain-knowledge distributions. The RandomForest
is trained on 4,000 synthetic samples at import time (deterministic seed).
When real labeled data is available, call `train_classifier(X, y)` to
replace the pre-trained model.
"""

from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Mode label constants
# ---------------------------------------------------------------------------

WALK = "WALK"
TWO_WHEELER = "TWO_WHEELER"
BUS_CAR = "BUS_CAR"
TRAIN_METRO = "TRAIN_METRO"

ALL_MODES: List[str] = [WALK, TWO_WHEELER, BUS_CAR, TRAIN_METRO]

# Feature vector column order — must stay consistent across extract / train / predict
FEATURE_COLS: List[str] = [
    "avg_speed_kmh",
    "max_speed_kmh",
    "p90_speed_kmh",
    "heading_variance",
    "speed_variance",
    "stop_ratio",
]

# ---------------------------------------------------------------------------
# Result dataclass
# ---------------------------------------------------------------------------


@dataclass
class ModeResult:
    """Output of classify_mode()."""

    predicted_mode: str
    confidence: float                        # 0.0 – 1.0 (RF probability or 1.0 for heuristic)
    method: str                              # "rf" | "heuristic" | "heuristic_fallback"
    features: Dict[str, float] = field(default_factory=dict)
    class_probabilities: Dict[str, float] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "predicted_mode": self.predicted_mode,
            "confidence": round(self.confidence, 4),
            "method": self.method,
            "features": {k: round(v, 4) for k, v in self.features.items()},
            "class_probabilities": {k: round(v, 4) for k, v in self.class_probabilities.items()},
        }


# ---------------------------------------------------------------------------
# 1. Feature Extraction
# ---------------------------------------------------------------------------


def extract_features(pings: List[Dict[str, Any]]) -> Dict[str, float]:
    """Extract motion features from a sequence of GPS pings for one trip leg.

    Parameters
    ----------
    pings : list of dict
        Each ping must contain at least:
          ``lat``   (float) — latitude in decimal degrees
          ``lon``   (float) — longitude in decimal degrees
          ``speed`` (float) — instantaneous speed in km/h  *(from device)*
        Optional:
          ``timestamp`` — used for ordering only; pings are processed in
          the order they are received if timestamp is absent.

    Returns
    -------
    dict with keys matching ``FEATURE_COLS``:
        avg_speed_kmh    : float
        max_speed_kmh    : float
        p90_speed_kmh    : float
        heading_variance : float  — circular variance ∈ [0, 1];
                                    0 = perfectly straight, 1 = fully random
        speed_variance   : float  — variance of speed samples (km/h)²
        stop_ratio       : float  — fraction of pings where speed < 3 km/h

    Raises
    ------
    ValueError
        If ``pings`` is empty or any ping is missing lat/lon.

    Notes
    -----
    * ``speed`` values of 0.0 are preserved as-is (genuine stops / GPS glitch).
    * Heading is computed geometrically from consecutive (lat, lon) pairs using
      the forward-bearing formula, so it works even when the device does not
      report a compass heading.  The bearing from the speed-based heading is
      preferred if present.
    * Circular variance is used for heading (not linear) to avoid the 359°/1°
      wrap-around artefact that would inflate ordinary variance.
    """
    if not pings:
        raise ValueError("extract_features: pings list is empty.")

    # ------------------------------------------------------------------
    # Parse & validate
    # ------------------------------------------------------------------
    lats: List[float] = []
    lons: List[float] = []
    speeds: List[float] = []

    for idx, p in enumerate(pings):
        try:
            lats.append(float(p["lat"]))
            lons.append(float(p["lon"]))
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(f"Ping #{idx} missing or invalid lat/lon: {p!r}") from exc

        # speed may be absent in some ping formats — default to 0
        try:
            speeds.append(max(0.0, float(p.get("speed", 0.0))))
        except (TypeError, ValueError):
            speeds.append(0.0)

    speeds_arr = np.array(speeds, dtype=np.float64)

    # ------------------------------------------------------------------
    # Speed features
    # ------------------------------------------------------------------
    avg_speed = float(np.mean(speeds_arr))
    max_speed = float(np.max(speeds_arr))
    p90_speed = float(np.percentile(speeds_arr, 90))
    speed_variance = float(np.var(speeds_arr))
    stop_ratio = float(np.sum(speeds_arr < 3.0) / len(speeds_arr))

    # ------------------------------------------------------------------
    # Bearing / heading variance (circular statistics)
    # ------------------------------------------------------------------
    heading_variance: float = 0.0

    if len(lats) >= 2:
        bearings_rad: List[float] = []
        for i in range(len(lats) - 1):
            b = _bearing_rad(lats[i], lons[i], lats[i + 1], lons[i + 1])
            bearings_rad.append(b)

        if bearings_rad:
            heading_variance = _circular_variance(bearings_rad)

    logger.debug(
        "extract_features: %d pings | avg=%.1f max=%.1f p90=%.1f "
        "hvar=%.3f svar=%.1f stop=%.2f",
        len(pings),
        avg_speed,
        max_speed,
        p90_speed,
        heading_variance,
        speed_variance,
        stop_ratio,
    )

    return {
        "avg_speed_kmh": avg_speed,
        "max_speed_kmh": max_speed,
        "p90_speed_kmh": p90_speed,
        "heading_variance": heading_variance,
        "speed_variance": speed_variance,
        "stop_ratio": stop_ratio,
    }


# ---------------------------------------------------------------------------
# 2. Rule-based Heuristic Classifier
# ---------------------------------------------------------------------------


def classify_mode_heuristic(features: Dict[str, float]) -> Tuple[str, float]:
    """Rule-based transport mode classification using Kerala domain thresholds.

    Parameters
    ----------
    features : dict
        Output of ``extract_features()``.

    Returns
    -------
    (mode_label, confidence) : tuple[str, float]
        ``confidence`` is a coarse estimate in {0.60, 0.70, 0.80, 0.90}
        — high enough to be useful, low enough to indicate it is heuristic.

    Decision Logic
    --------------
    The rules are ordered from most- to least-restrictive so that the first
    matching branch wins.  Thresholds are calibrated for Kerala conditions:

    TRAIN_METRO  : sustained high speed + very low heading variance
                   (fixed track → almost no turns)
    WALK         : low average AND low p90 speed
    TWO_WHEELER  : moderate speed + elevated heading variance
                   (frequent lane changes, narrow roads)
    BUS_CAR      : catch-all for mid-range speeds (also covers autos)
    """
    avg   = features.get("avg_speed_kmh", 0.0)
    max_s = features.get("max_speed_kmh", 0.0)
    p90   = features.get("p90_speed_kmh", 0.0)
    hvar  = features.get("heading_variance", 0.0)
    stop  = features.get("stop_ratio", 0.0)

    # --- TRAIN / METRO ---
    # Kochi Metro: 30–80 km/h avg, very straight corridor (hvar < 0.15)
    # Kerala Rail: 60–130 km/h avg, nearly zero heading variance
    if avg >= 45.0 and hvar < 0.18:
        return TRAIN_METRO, 0.82

    # --- WALK ---
    # Pedestrian or slow cyclist: very low p90 speed
    if p90 < 8.0 and avg < 7.0:
        return WALK, 0.88

    # --- TWO_WHEELER ---
    # Motorbike on Kerala roads: moderate speed, weaves through traffic
    # Higher heading variance due to narrow lane changes
    if avg < 45.0 and hvar >= 0.30 and p90 < 55.0:
        return TWO_WHEELER, 0.74

    # --- BUS_CAR ---
    # Bus: frequent stops → high stop_ratio, moderate speed
    # Car/Taxi: smooth but mid-range speeds
    if avg >= 7.0 or max_s >= 15.0:
        return BUS_CAR, 0.72

    # --- Fallback: WALK (very slow / stationary) ---
    return WALK, 0.60


# ---------------------------------------------------------------------------
# 3. Random Forest Classifier
# ---------------------------------------------------------------------------


def build_classifier(random_state: int = 42) -> RandomForestClassifier:
    """Instantiate a lightweight RandomForestClassifier for mode inference."""
    return RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        min_samples_leaf=4,
        max_features="sqrt",
        class_weight="balanced",
        random_state=random_state,
        n_jobs=1,
    )


def train_classifier(
    X: np.ndarray,
    y: np.ndarray,
    random_state: int = 42,
) -> RandomForestClassifier:
    """Train a RandomForestClassifier on labeled feature data.

    Parameters
    ----------
    X : np.ndarray, shape (n_samples, 6)
        Feature matrix in FEATURE_COLS column order.
    y : np.ndarray, shape (n_samples,)
        String labels — one of WALK, TWO_WHEELER, BUS_CAR, TRAIN_METRO.
    random_state : int
        Seed for reproducibility.

    Returns
    -------
    Fitted RandomForestClassifier.

    Usage
    -----
    When real labeled trip data becomes available (e.g. from user
    verification corrections), collect feature rows and their confirmed
    modes and call this function to replace the synthetic pre-trained model.
    """
    clf = build_classifier(random_state=random_state)
    clf.fit(X, y)
    logger.info(
        "train_classifier: trained RF on %d samples | classes=%s",
        len(y),
        clf.classes_.tolist(),
    )
    return clf


def predict_mode_rf(
    features: Dict[str, float],
    classifier: RandomForestClassifier,
) -> Tuple[str, float, Dict[str, float]]:
    """Run Random Forest inference on a feature dict.

    Parameters
    ----------
    features : dict
        Output of ``extract_features()``.
    classifier : RandomForestClassifier
        A fitted sklearn RandomForestClassifier.

    Returns
    -------
    (mode_label, confidence, class_probabilities)
    """
    x = np.array([[features.get(col, 0.0) for col in FEATURE_COLS]])
    proba = classifier.predict_proba(x)[0]
    classes: List[str] = classifier.classes_.tolist()

    best_idx: int = int(np.argmax(proba))
    mode: str = classes[best_idx]
    confidence: float = float(proba[best_idx])
    class_probs: Dict[str, float] = {c: float(p) for c, p in zip(classes, proba)}

    return mode, confidence, class_probs


# ---------------------------------------------------------------------------
# 4. Top-level Convenience Function
# ---------------------------------------------------------------------------

# Confidence threshold below which we fall back to the heuristic
_RF_CONFIDENCE_THRESHOLD: float = 0.55


def classify_mode(
    pings: List[Dict[str, Any]],
    classifier: Optional[RandomForestClassifier] = None,
) -> ModeResult:
    """Classify transport mode from a sequence of GPS pings for one trip leg.

    Parameters
    ----------
    pings : list of dict
        Consecutive GPS pings for a single trip leg.  See ``extract_features``
        for the required ping schema.
    classifier : RandomForestClassifier, optional
        A fitted sklearn RF model.  If ``None``, the heuristic is used.
        Pass the module-level ``DEFAULT_CLASSIFIER`` for zero-config usage.

    Returns
    -------
    ModeResult
        Dataclass with predicted_mode, confidence, method, features, and
        class_probabilities.

    Examples
    --------
    >>> from app.pipelines.mode_classifier import classify_mode, DEFAULT_CLASSIFIER
    >>> pings = [{"lat": 9.93, "lon": 76.26, "speed": 45.0}, ...]
    >>> result = classify_mode(pings, DEFAULT_CLASSIFIER)
    >>> print(result.predicted_mode, result.confidence)
    BUS_CAR 0.84
    """
    # ------------------------------------------------------------------
    # Feature extraction
    # ------------------------------------------------------------------
    try:
        features = extract_features(pings)
    except ValueError as exc:
        logger.error("classify_mode: feature extraction failed — %s", exc)
        return ModeResult(
            predicted_mode=WALK,
            confidence=0.0,
            method="error_fallback",
            features={},
            class_probabilities={},
        )

    # ------------------------------------------------------------------
    # RF inference (if classifier available)
    # ------------------------------------------------------------------
    if classifier is not None:
        try:
            mode, confidence, class_probs = predict_mode_rf(features, classifier)

            if confidence >= _RF_CONFIDENCE_THRESHOLD:
                return ModeResult(
                    predicted_mode=mode,
                    confidence=confidence,
                    method="rf",
                    features=features,
                    class_probabilities=class_probs,
                )
            else:
                logger.debug(
                    "classify_mode: RF confidence %.2f below threshold %.2f — "
                    "falling back to heuristic.",
                    confidence,
                    _RF_CONFIDENCE_THRESHOLD,
                )
                h_mode, h_conf = classify_mode_heuristic(features)
                return ModeResult(
                    predicted_mode=h_mode,
                    confidence=h_conf,
                    method="heuristic_fallback",
                    features=features,
                    class_probabilities=class_probs,
                )
        except Exception as exc:
            logger.warning(
                "classify_mode: RF inference failed (%s) — using heuristic.", exc
            )

    # ------------------------------------------------------------------
    # Pure heuristic
    # ------------------------------------------------------------------
    h_mode, h_conf = classify_mode_heuristic(features)
    return ModeResult(
        predicted_mode=h_mode,
        confidence=h_conf,
        method="heuristic",
        features=features,
        class_probabilities={m: (1.0 if m == h_mode else 0.0) for m in ALL_MODES},
    )


# ---------------------------------------------------------------------------
# Synthetic data generator + module-level pre-trained classifier
# ---------------------------------------------------------------------------


def _generate_synthetic_data(
    n_samples: int = 4000,
    random_state: int = 42,
) -> Tuple[np.ndarray, np.ndarray]:
    """Generate realistic synthetic training data from domain knowledge.

    Each class is modelled as a multivariate normal distribution centred on
    realistic Kerala transport characteristics.  The distributions overlap
    (as in the real world) to prevent the RF from over-fitting to clean
    boundaries.

    Feature order: avg_speed, max_speed, p90_speed, heading_var, speed_var, stop_ratio
    """
    rng = np.random.default_rng(random_state)
    samples_per_class = n_samples // len(ALL_MODES)

    # (mean_vector, std_vector) per class — each vector corresponds to FEATURE_COLS
    # [avg_kmh, max_kmh, p90_kmh, hvar, speed_var, stop_ratio]
    class_params: Dict[str, Tuple[List[float], List[float]]] = {
        WALK: (
            [3.5,  7.0,  5.5,  0.42, 2.5,  0.55],   # means
            [1.5,  2.5,  2.0,  0.15, 1.5,  0.18],   # stds
        ),
        TWO_WHEELER: (
            [28.0, 60.0, 50.0, 0.38, 55.0, 0.12],
            [8.0,  15.0, 12.0, 0.12, 25.0, 0.08],
        ),
        BUS_CAR: (
            [32.0, 75.0, 60.0, 0.22, 80.0, 0.25],
            [10.0, 18.0, 15.0, 0.09, 35.0, 0.12],
        ),
        TRAIN_METRO: (
            [58.0, 95.0, 85.0, 0.07, 120.0, 0.15],
            [15.0, 20.0, 18.0, 0.04, 50.0,  0.08],
        ),
    }

    X_parts: List[np.ndarray] = []
    y_parts: List[np.ndarray] = []

    for label, (means, stds) in class_params.items():
        chunk = rng.normal(
            loc=np.array(means),
            scale=np.array(stds),
            size=(samples_per_class, len(FEATURE_COLS)),
        )
        # Clip to physically valid ranges
        chunk[:, 0] = np.clip(chunk[:, 0], 0.0, 200.0)   # avg_speed
        chunk[:, 1] = np.clip(chunk[:, 1], 0.0, 250.0)   # max_speed
        chunk[:, 2] = np.clip(chunk[:, 2], 0.0, 220.0)   # p90_speed
        chunk[:, 3] = np.clip(chunk[:, 3], 0.0, 1.0)     # heading_variance
        chunk[:, 4] = np.clip(chunk[:, 4], 0.0, None)    # speed_variance
        chunk[:, 5] = np.clip(chunk[:, 5], 0.0, 1.0)     # stop_ratio

        X_parts.append(chunk)
        y_parts.append(np.full(samples_per_class, label))

    X = np.vstack(X_parts)
    y = np.concatenate(y_parts)

    # Shuffle
    idx = rng.permutation(len(y))
    return X[idx], y[idx]


def _build_default_classifier() -> RandomForestClassifier:
    """Build and return the module-level pre-trained classifier."""
    logger.info("mode_classifier: training default RF on synthetic data...")
    X, y = _generate_synthetic_data(n_samples=4000, random_state=42)
    clf = train_classifier(X, y, random_state=42)
    logger.info(
        "mode_classifier: default RF ready — OOB not available (oob_score=False)."
    )
    return clf


# Pre-trained at import time — used as the default classifier.
# Replace with a real-data-trained model by calling train_classifier().
DEFAULT_CLASSIFIER: RandomForestClassifier = _build_default_classifier()


# ---------------------------------------------------------------------------
# Internal geometry helpers
# ---------------------------------------------------------------------------


def _bearing_rad(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute the forward bearing from (lat1, lon1) → (lat2, lon2) in radians.

    Uses the standard spherical forward-azimuth formula.
    Returns a value in [0, 2π).
    """
    lat1_r = math.radians(lat1)
    lat2_r = math.radians(lat2)
    d_lon_r = math.radians(lon2 - lon1)

    x = math.sin(d_lon_r) * math.cos(lat2_r)
    y = (
        math.cos(lat1_r) * math.sin(lat2_r)
        - math.sin(lat1_r) * math.cos(lat2_r) * math.cos(d_lon_r)
    )
    bearing = math.atan2(x, y)
    return bearing % (2.0 * math.pi)   # normalise to [0, 2π)


def _circular_variance(bearings_rad: List[float]) -> float:
    """Compute circular variance of a list of angles (in radians).

    Returns a value in [0, 1]:
      - 0.0  → all bearings identical (perfectly straight path)
      - 1.0  → bearings uniformly spread over the full circle (random walk)

    Formula: V = 1 − R̄  where R̄ = |mean resultant vector|

    Reference: Fisher (1993) Statistical Analysis of Circular Data, §2.3
    """
    if not bearings_rad:
        return 0.0
    arr = np.array(bearings_rad)
    r_bar = np.abs(np.mean(np.exp(1j * arr)))   # mean resultant length
    return float(1.0 - r_bar)
