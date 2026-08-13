"""
trip_segmentation.py
====================
Kerala Mobility Platform — ML Service
--------------------------------------
Converts raw GPS telemetry pings into:
  1. Detected dwell stops  (detect_stops)          <- production-ready
  2. Transport-mode classification (classify_transport_mode)
  3. End-to-end trip segmentation (segment_and_predict_trips)

Stop Definition (NATPAC spec)
-------------------------------
A *stop* is a cluster of GPS pings where the user remained within a
50-metre radius for at least 10 consecutive minutes.

Algorithm
---------
* Spatial clustering  : scikit-learn DBSCAN with the haversine metric.
* epsilon             : 50 m converted to radians for the haversine kernel.
* min_samples         : dynamically computed from the minimum dwell time
                        (10 min) divided by the median ping interval, so
                        it adapts to variable sampling rates.
* Temporal validation : After spatial clustering, each candidate cluster is
                        validated to confirm that the actual time span
                        (departure - arrival) >= 10 minutes. Clusters that
                        are spatially tight but temporally brief (e.g. a
                        traffic jam) are discarded.
* Centroid            : Arithmetic mean of all pings inside the cluster
                        (sufficient accuracy at sub-100 m scale).
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EARTH_RADIUS_KM: float = 6_371.0088      # mean Earth radius (WGS-84 approx)
STOP_RADIUS_M: float = 50.0              # maximum cluster radius in metres
STOP_MIN_DURATION_MIN: float = 10.0      # minimum dwell time in minutes

# ---------------------------------------------------------------------------
# Public API — Stop Detection
# ---------------------------------------------------------------------------


def detect_stops(
    pings: List[Dict[str, Any]],
    *,
    radius_m: float = STOP_RADIUS_M,
    min_duration_min: float = STOP_MIN_DURATION_MIN,
    timestamp_key: str = "timestamp",
    lat_key: str = "lat",
    lon_key: str = "lon",
) -> pd.DataFrame:
    """Detect dwell stops from a sequence of raw GPS pings.

    Parameters
    ----------
    pings : list of dict
        Each element must have at least ``lat``, ``lon``, and ``timestamp``
        keys (key names are configurable via the keyword arguments below).
        ``timestamp`` may be:
          - an ISO-8601 string (e.g. ``"2024-01-15T08:10:00+05:30"``)
          - a ``datetime`` object (timezone-aware or naive)
          - a Unix epoch int or float (seconds since epoch)
        Pings are sorted internally by timestamp, so they need not arrive
        in chronological order.
    radius_m : float, optional
        Spatial radius threshold for a stop cluster in metres.
        Default: 50 m (NATPAC spec).
    min_duration_min : float, optional
        Minimum dwell time to qualify as a stop in minutes.
        Default: 10 min (NATPAC spec).
    timestamp_key : str, optional
        Key used to read the timestamp field from each ping dict.
    lat_key : str, optional
        Key used to read latitude.
    lon_key : str, optional
        Key used to read longitude.

    Returns
    -------
    pd.DataFrame
        One row per detected stop with columns:

        stop_id          int    - Zero-based sequential stop identifier.
        centroid_lat     float  - Mean latitude of all pings in the stop cluster.
        centroid_lon     float  - Mean longitude of all pings in the stop cluster.
        arrival_time     datetime - Timestamp of the first ping in the cluster.
        departure_time   datetime - Timestamp of the last ping in the cluster.
        duration_minutes float  - Dwell time = departure - arrival (minutes).
        ping_count       int    - Number of raw pings contributing to the stop.

        Returns an **empty DataFrame** (with the above schema) when:
          * ``pings`` is empty or has fewer than 2 entries.
          * No cluster survives the temporal validation filter.

    Raises
    ------
    ValueError
        If a ping is missing a required field or contains an unparseable
        timestamp, a descriptive ValueError is raised identifying the
        offending ping index.

    Notes
    -----
    * GPS noise / low-accuracy fixes are handled implicitly by DBSCAN: stray
      pings that fall outside the epsilon-neighbourhood of any cluster are
      labelled as noise (label = -1) and ignored.
    * min_samples is computed adaptively from the median inter-ping interval,
      so the function works correctly across different device sampling rates
      (e.g. 1 Hz, 0.1 Hz, duty-cycled modes).
    """
    # ------------------------------------------------------------------
    # 1. Validate & parse inputs
    # ------------------------------------------------------------------
    if not pings or len(pings) < 2:
        logger.warning(
            "detect_stops: fewer than 2 pings supplied — returning empty DataFrame."
        )
        return _empty_stops_df()

    parsed: List[Dict[str, Any]] = []
    for idx, ping in enumerate(pings):
        try:
            lat = float(ping[lat_key])
            lon = float(ping[lon_key])
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(
                f"Ping #{idx} is missing or has invalid "
                f"'{lat_key}'/'{lon_key}' field: {ping!r}"
            ) from exc

        try:
            ts = _parse_timestamp(ping[timestamp_key])
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(
                f"Ping #{idx} has an unparseable '{timestamp_key}' field: {ping!r}"
            ) from exc

        if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
            raise ValueError(
                f"Ping #{idx} has out-of-range coordinates: lat={lat}, lon={lon}"
            )

        parsed.append({"lat": lat, "lon": lon, "ts": ts})

    # ------------------------------------------------------------------
    # 2. Sort by timestamp
    # ------------------------------------------------------------------
    parsed.sort(key=lambda p: p["ts"])

    lats = np.array([p["lat"] for p in parsed], dtype=np.float64)
    lons = np.array([p["lon"] for p in parsed], dtype=np.float64)
    timestamps: List[datetime] = [p["ts"] for p in parsed]

    # ------------------------------------------------------------------
    # 3. Compute adaptive min_samples from ping density
    # ------------------------------------------------------------------
    # Estimate median inter-ping interval (seconds); floor at 1 s to avoid /0.
    intervals_s: np.ndarray = np.diff(
        np.array([t.timestamp() for t in timestamps])
    )
    median_interval_s: float = (
        float(np.median(intervals_s)) if len(intervals_s) > 0 else 1.0
    )
    median_interval_s = max(median_interval_s, 1.0)

    min_duration_s: float = min_duration_min * 60.0
    min_samples: int = max(2, int(np.ceil(min_duration_s / median_interval_s)))

    logger.debug(
        "detect_stops: %d pings | radius=%.0f m | median_interval=%.1f s | min_samples=%d",
        len(parsed),
        radius_m,
        median_interval_s,
        min_samples,
    )

    # ------------------------------------------------------------------
    # 4. DBSCAN spatial clustering with haversine metric
    #    Note: haversine expects (lat, lon) in **radians**.
    # ------------------------------------------------------------------
    epsilon_rad: float = (radius_m / 1_000.0) / EARTH_RADIUS_KM

    coords_rad = np.radians(np.column_stack([lats, lons]))  # shape (n, 2)

    db = DBSCAN(
        eps=epsilon_rad,
        min_samples=min_samples,
        algorithm="ball_tree",  # required for haversine
        metric="haversine",
        n_jobs=1,               # deterministic; parallelise at the caller level
    )
    labels: np.ndarray = db.fit_predict(coords_rad)

    # ------------------------------------------------------------------
    # 5. Build candidate stops per cluster label
    # ------------------------------------------------------------------
    unique_labels = sorted(set(labels.tolist()))
    stops: List[Dict[str, Any]] = []

    for label in unique_labels:
        if label == -1:
            # Noise pings — not a stop
            continue

        mask: np.ndarray = labels == label
        cluster_lats = lats[mask]
        cluster_lons = lons[mask]
        cluster_ts: List[datetime] = [
            ts for ts, m in zip(timestamps, mask.tolist()) if m
        ]

        arrival_time: datetime = cluster_ts[0]
        departure_time: datetime = cluster_ts[-1]
        duration_s: float = (departure_time - arrival_time).total_seconds()
        duration_min: float = duration_s / 60.0

        # --------------------------------------------------------------
        # 6. Temporal validation — discard spatially tight but brief clusters
        #    (e.g. a slow traffic jam that happens to keep the GPS within 50 m)
        # --------------------------------------------------------------
        if duration_min < min_duration_min:
            logger.debug(
                "Cluster %d rejected: duration %.1f min < %.1f min threshold",
                label,
                duration_min,
                min_duration_min,
            )
            continue

        centroid_lat: float = float(np.mean(cluster_lats))
        centroid_lon: float = float(np.mean(cluster_lons))

        stops.append(
            {
                "stop_id": len(stops),           # sequential 0-based after filtering
                "centroid_lat": round(centroid_lat, 7),
                "centroid_lon": round(centroid_lon, 7),
                "arrival_time": arrival_time,
                "departure_time": departure_time,
                "duration_minutes": round(duration_min, 2),
                "ping_count": int(mask.sum()),
            }
        )

    # ------------------------------------------------------------------
    # 7. Return structured DataFrame
    # ------------------------------------------------------------------
    if not stops:
        logger.info(
            "detect_stops: no qualifying stops found in %d pings.", len(parsed)
        )
        return _empty_stops_df()

    df = pd.DataFrame(
        stops,
        columns=[
            "stop_id",
            "centroid_lat",
            "centroid_lon",
            "arrival_time",
            "departure_time",
            "duration_minutes",
            "ping_count",
        ],
    )

    logger.info(
        "detect_stops: detected %d stop(s) from %d pings.", len(df), len(parsed)
    )
    return df


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _empty_stops_df() -> pd.DataFrame:
    """Return a correctly-typed empty DataFrame matching detect_stops schema."""
    return pd.DataFrame(
        columns=[
            "stop_id",
            "centroid_lat",
            "centroid_lon",
            "arrival_time",
            "departure_time",
            "duration_minutes",
            "ping_count",
        ]
    ).astype(
        {
            "stop_id": "Int64",
            "centroid_lat": "float64",
            "centroid_lon": "float64",
            "duration_minutes": "float64",
            "ping_count": "Int64",
        }
    )


def _parse_timestamp(value: Any) -> datetime:
    """Coerce *value* to a timezone-aware ``datetime`` (UTC if naive).

    Accepts:
    * ``datetime`` objects (aware or naive)
    * ISO-8601 strings  (e.g. "2024-01-15T08:10:00+05:30" or "...Z")
    * Unix epoch ints / floats
    """
    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, (int, float)):
        dt = datetime.fromtimestamp(value, tz=timezone.utc)
    elif isinstance(value, str):
        # Python >= 3.7 compatibility: replace trailing 'Z' with '+00:00'
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    else:
        raise ValueError(f"Unsupported timestamp type: {type(value)!r}")

    # Ensure timezone-aware (assume UTC if naive)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


# ---------------------------------------------------------------------------
# Legacy functions — preserved for backward compatibility with main.py
# ---------------------------------------------------------------------------


def classify_transport_mode(avg_speed_kmh: float, max_speed_kmh: float) -> str:
    """
    Predict transport mode based on telemetry speed features.
    """
    if avg_speed_kmh < 6.0:
        return "Walking"
    elif avg_speed_kmh < 22.0:
        return "Auto/Two-Wheeler"
    elif avg_speed_kmh < 50.0:
        return "Bus"
    elif avg_speed_kmh < 85.0:
        return "Car/Taxi"
    else:
        return "Train/Express"


def segment_and_predict_trips(pings: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Clusters GPS pings using DBSCAN stop detection and classifies trip segments.
    """
    if not pings:
        return {"status": "empty", "trips": []}

    coords = []
    speeds = []
    timestamps = []

    for p in pings:
        lat = float(p.get("lat", 0.0))
        lon = float(p.get("lon", 0.0))
        speed = float(p.get("speed", 0.0))
        ts = p.get("timestamp")

        coords.append([lat, lon])
        speeds.append(speed)
        timestamps.append(ts)

    if len(coords) >= 2:
        coords_arr = np.array(coords)
        kms_per_radian = 6371.0088
        epsilon = 0.05 / kms_per_radian
        radians_arr = np.radians(coords_arr)
        db = DBSCAN(eps=epsilon, min_samples=2, metric="haversine").fit(radians_arr)
        labels = db.labels_.tolist()
    else:
        labels = [0] * len(coords)

    origin_lat = coords[0][0]
    origin_lon = coords[0][1]
    dest_lat = coords[-1][0]
    dest_lon = coords[-1][1]

    avg_speed = float(np.mean(speeds)) if speeds else 0.0
    max_speed = float(np.max(speeds)) if speeds else 0.0

    predicted_mode = classify_transport_mode(avg_speed, max_speed)

    user_id = pings[0].get("device_id", "anonymous_user")
    start_time = timestamps[0] if timestamps else datetime.now(timezone.utc).isoformat()
    end_time = timestamps[-1] if timestamps else datetime.now(timezone.utc).isoformat()

    segmented_trip = {
        "user_id": user_id,
        "origin_lat": origin_lat,
        "origin_lon": origin_lon,
        "dest_lat": dest_lat,
        "dest_lon": dest_lon,
        "start_time": start_time,
        "end_time": end_time,
        "predicted_mode": predicted_mode,
        "avg_speed_kmh": round(avg_speed, 2),
        "cluster_labels": labels,
    }

    return {
        "status": "success",
        "total_pings_processed": len(pings),
        "trips": [segmented_trip],
    }
