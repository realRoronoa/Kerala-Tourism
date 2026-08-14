"""
main.py
=======
NATPAC Kerala Mobility — ML Microservice
-----------------------------------------
Endpoints:

  GET  /health                       — liveness check
  POST /segment-stops                — legacy trip segmentation (Aman's backend uses this)
  POST /api/ml/analyze-trip          — full pipeline: stops + per-leg mode classification
  POST /api/ml/generate-itinerary    — RAG + Gemini personalised trip planner
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

from app.pipelines.trip_segmentation import detect_stops, segment_and_predict_trips
from app.pipelines.mode_classifier import classify_mode, DEFAULT_CLASSIFIER
from app.pipelines.itinerary_generator import generate_trip_plan

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="NATPAC Kerala Mobility ML Microservice",
    version="2.0.0",
    description=(
        "ML inference microservice for the Kerala Mobility Platform. "
        "Performs GPS stop detection (DBSCAN/haversine) and transport "
        "mode classification (Random Forest + heuristic fallback)."
    ),
)


# ---------------------------------------------------------------------------
# Shared Pydantic schemas
# ---------------------------------------------------------------------------


class TelemetryBatchSchema(BaseModel):
    """Legacy schema used by Aman's telemetry_worker → /segment-stops."""
    pings: List[Dict[str, Any]]


class AnalyzeTripRequest(BaseModel):
    """Request body for POST /api/ml/analyze-trip."""

    user_id: str = Field(..., description="Opaque device/user identifier.")
    pings: List[Dict[str, Any]] = Field(
        ...,
        min_length=2,
        description=(
            "Chronologically ordered GPS pings. Each ping must contain: "
            "lat (float), lon (float), timestamp (ISO-8601 or epoch). "
            "Optional: speed (float, km/h)."
        ),
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _parse_ping_timestamp(ping: Dict[str, Any]) -> Optional[datetime]:
    """Return a timezone-aware datetime from a ping's timestamp field, or None."""
    raw = ping.get("timestamp")
    if raw is None:
        return None
    try:
        from app.pipelines.trip_segmentation import _parse_timestamp
        return _parse_timestamp(raw)
    except Exception:
        return None


def _extract_legs(
    sorted_pings: List[Dict[str, Any]],
    stops_df,
) -> List[Dict[str, Any]]:
    """
    Slice `sorted_pings` into trip legs that fall **between** detected stops.

    A leg is defined as: pings that occur strictly between
        stop[i].departure_time  and  stop[i+1].arrival_time

    Additionally we include:
      - A "before_first_stop" leg if pings exist before stop[0].arrival_time
      - An "after_last_stop"  leg if pings exist after  stop[-1].departure_time

    Parameters
    ----------
    sorted_pings : list of dict
        Pings already sorted ascending by timestamp.
    stops_df : pd.DataFrame
        Output of detect_stops() — may be empty.

    Returns
    -------
    list of dict, each with:
        leg_id         int
        leg_type       str   ("before_first_stop" | "between_stops" | "after_last_stop" | "no_stops")
        from_stop_id   int | None
        to_stop_id     int | None
        start_time     str   (ISO-8601)
        end_time       str   (ISO-8601)
        ping_count     int
        pings          list  (the raw ping dicts in this leg)
    """
    legs: List[Dict[str, Any]] = []

    if stops_df.empty:
        # No stops → the entire ping sequence is one continuous leg
        if sorted_pings:
            ts_start = _parse_ping_timestamp(sorted_pings[0])
            ts_end   = _parse_ping_timestamp(sorted_pings[-1])
            legs.append({
                "leg_id":       0,
                "leg_type":     "no_stops",
                "from_stop_id": None,
                "to_stop_id":   None,
                "start_time":   ts_start.isoformat() if ts_start else None,
                "end_time":     ts_end.isoformat()   if ts_end   else None,
                "ping_count":   len(sorted_pings),
                "pings":        sorted_pings,
            })
        return legs

    # Build a list of (arrival_dt, departure_dt) per stop — already sorted by stop_id
    stop_windows: List[tuple] = [
        (row["arrival_time"], row["departure_time"], int(row["stop_id"]))
        for _, row in stops_df.iterrows()
    ]

    def _iso(dt: Optional[datetime]) -> Optional[str]:
        return dt.isoformat() if dt else None

    def _pings_in_window(after: Optional[datetime], before: Optional[datetime]):
        """Filter sorted_pings to those strictly inside (after, before)."""
        result = []
        for p in sorted_pings:
            ts = _parse_ping_timestamp(p)
            if ts is None:
                continue
            if after is not None and ts <= after:
                continue
            if before is not None and ts >= before:
                continue
            result.append(p)
        return result

    leg_id = 0

    # --- Leg BEFORE the first stop ---
    first_arrival = stop_windows[0][0]
    pre_pings = _pings_in_window(None, first_arrival)
    if pre_pings:
        ts_s = _parse_ping_timestamp(pre_pings[0])
        ts_e = _parse_ping_timestamp(pre_pings[-1])
        legs.append({
            "leg_id":       leg_id,
            "leg_type":     "before_first_stop",
            "from_stop_id": None,
            "to_stop_id":   stop_windows[0][2],
            "start_time":   _iso(ts_s),
            "end_time":     _iso(ts_e),
            "ping_count":   len(pre_pings),
            "pings":        pre_pings,
        })
        leg_id += 1

    # --- Legs BETWEEN consecutive stops ---
    for i in range(len(stop_windows) - 1):
        _, depart_i, stop_id_i       = stop_windows[i]
        arrive_j, _, stop_id_j = stop_windows[i + 1]

        between_pings = _pings_in_window(depart_i, arrive_j)
        if between_pings:
            ts_s = _parse_ping_timestamp(between_pings[0])
            ts_e = _parse_ping_timestamp(between_pings[-1])
            legs.append({
                "leg_id":       leg_id,
                "leg_type":     "between_stops",
                "from_stop_id": stop_id_i,
                "to_stop_id":   stop_id_j,
                "start_time":   _iso(ts_s),
                "end_time":     _iso(ts_e),
                "ping_count":   len(between_pings),
                "pings":        between_pings,
            })
            leg_id += 1

    # --- Leg AFTER the last stop ---
    last_departure = stop_windows[-1][1]
    post_pings = _pings_in_window(last_departure, None)
    if post_pings:
        ts_s = _parse_ping_timestamp(post_pings[0])
        ts_e = _parse_ping_timestamp(post_pings[-1])
        legs.append({
            "leg_id":       leg_id,
            "leg_type":     "after_last_stop",
            "from_stop_id": stop_windows[-1][2],
            "to_stop_id":   None,
            "start_time":   _iso(ts_s),
            "end_time":     _iso(ts_e),
            "ping_count":   len(post_pings),
            "pings":        post_pings,
        })

    return legs


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/")
@app.get("/health")
def health_check():
    """Liveness check — called by Aman's backend and Docker healthcheck."""
    return {
        "status":  "healthy",
        "service": "NATPAC ML Inference Microservice",
        "version": "2.0.0",
        "port":    8001,
    }


@app.post("/segment-stops")
def segment_stops_endpoint(batch: TelemetryBatchSchema):
    """
    Legacy endpoint — Aman's telemetry_worker calls this.
    Accepts raw batched telemetry pings, executes DBSCAN stop clustering and
    transport mode classification, returning structured trip inference.
    """
    if not batch.pings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload must contain non-empty 'pings' list.",
        )
    return segment_and_predict_trips(batch.pings)


@app.post("/api/ml/analyze-trip")
def analyze_trip(request: AnalyzeTripRequest):
    """Full trip analysis pipeline: stop detection + per-leg mode classification.

    Flow
    ----
    1. Run DBSCAN stop detection on the full ping sequence.
    2. Slice the pings into trip legs between detected stops.
    3. For each leg, extract motion features and classify transport mode
       using the Random Forest (with heuristic fallback).
    4. Return a unified JSON with stops and annotated trip legs.

    Request Body
    ------------
    {
        "user_id": "device-abc123",
        "pings": [
            {"lat": 9.9312, "lon": 76.2673, "speed": 0.0, "timestamp": "2024-08-13T08:10:00+05:30"},
            ...
        ]
    }

    Response Schema
    ---------------
    {
        "user_id": str,
        "total_pings": int,
        "analysis_timestamp": str,        // ISO-8601 UTC
        "stops": [
            {
                "stop_id": int,
                "centroid_lat": float,
                "centroid_lon": float,
                "arrival_time": str,      // ISO-8601
                "departure_time": str,    // ISO-8601
                "duration_minutes": float,
                "ping_count": int
            },
            ...
        ],
        "trip_legs": [
            {
                "leg_id": int,
                "leg_type": str,          // "no_stops" | "before_first_stop" | "between_stops" | "after_last_stop"
                "from_stop_id": int|null,
                "to_stop_id":   int|null,
                "start_time":   str|null,
                "end_time":     str|null,
                "ping_count":   int,
                "predicted_mode": str,    // WALK | TWO_WHEELER | BUS_CAR | TRAIN_METRO
                "confidence":   float,
                "classification_method": str,
                "features": {
                    "avg_speed_kmh": float,
                    "max_speed_kmh": float,
                    "p90_speed_kmh": float,
                    "heading_variance": float,
                    "speed_variance": float,
                    "stop_ratio": float
                }
            },
            ...
        ],
        "summary": {
            "stop_count": int,
            "leg_count": int,
            "modes_detected": [str, ...]  // unique modes across all legs
        }
    }
    """
    user_id  = request.user_id
    pings    = request.pings

    # ------------------------------------------------------------------
    # Step 1: Sort pings by timestamp (ascending)
    # ------------------------------------------------------------------
    def _sort_key(p: Dict[str, Any]) -> float:
        """Return epoch seconds for sorting; push None-timestamp pings to end."""
        ts = _parse_ping_timestamp(p)
        return ts.timestamp() if ts is not None else float("inf")

    try:
        sorted_pings = sorted(pings, key=_sort_key)
    except Exception as exc:
        logger.error("analyze_trip: failed sorting pings for user=%s: %s", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to sort pings by timestamp: {exc}",
        )

    # ------------------------------------------------------------------
    # Step 2: Detect stops via DBSCAN
    # ------------------------------------------------------------------
    try:
        stops_df = detect_stops(sorted_pings)
    except ValueError as exc:
        logger.warning(
            "analyze_trip: detect_stops raised ValueError for user=%s: %s",
            user_id, exc,
        )
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Stop detection failed: {exc}",
        )
    except Exception as exc:
        logger.exception("analyze_trip: unexpected error in detect_stops for user=%s", user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal stop detection error: {exc}",
        )

    # Serialise stops DataFrame to a list of dicts (datetime → ISO string)
    stops_out: List[Dict[str, Any]] = []
    for _, row in stops_df.iterrows():
        stops_out.append({
            "stop_id":          int(row["stop_id"]),
            "centroid_lat":     float(row["centroid_lat"]),
            "centroid_lon":     float(row["centroid_lon"]),
            "arrival_time":     row["arrival_time"].isoformat() if row["arrival_time"] is not None else None,
            "departure_time":   row["departure_time"].isoformat() if row["departure_time"] is not None else None,
            "duration_minutes": float(row["duration_minutes"]),
            "ping_count":       int(row["ping_count"]),
        })

    # ------------------------------------------------------------------
    # Step 3: Slice pings into trip legs between stops
    # ------------------------------------------------------------------
    raw_legs = _extract_legs(sorted_pings, stops_df)

    # ------------------------------------------------------------------
    # Step 4: Classify transport mode for each leg
    # ------------------------------------------------------------------
    trip_legs_out: List[Dict[str, Any]] = []
    modes_seen: List[str] = []

    for leg in raw_legs:
        leg_pings = leg.get("pings", [])
        
        origin_lat = leg_pings[0]["lat"] if leg_pings else 0.0
        origin_lon = leg_pings[0]["lon"] if leg_pings else 0.0
        dest_lat = leg_pings[-1]["lat"] if leg_pings else 0.0
        dest_lon = leg_pings[-1]["lon"] if leg_pings else 0.0

        if len(leg_pings) < 2:
            # Too few pings to classify meaningfully — mark as unknown
            trip_legs_out.append({
                "leg_id":                  leg["leg_id"],
                "leg_type":                leg["leg_type"],
                "from_stop_id":            leg["from_stop_id"],
                "to_stop_id":              leg["to_stop_id"],
                "origin_lat":              origin_lat,
                "origin_lon":              origin_lon,
                "dest_lat":                dest_lat,
                "dest_lon":                dest_lon,
                "start_time":              leg["start_time"],
                "end_time":                leg["end_time"],
                "ping_count":              leg["ping_count"],
                "predicted_mode":          "UNKNOWN",
                "confidence":              0.0,
                "classification_method":   "insufficient_pings",
                "features":                {},
            })
            continue

        try:
            result = classify_mode(leg_pings, DEFAULT_CLASSIFIER)
        except Exception as exc:
            logger.warning(
                "analyze_trip: classify_mode failed on leg %d for user=%s: %s",
                leg["leg_id"], user_id, exc,
            )
            result = None

        if result is not None:
            modes_seen.append(result.predicted_mode)
            trip_legs_out.append({
                "leg_id":                leg["leg_id"],
                "leg_type":              leg["leg_type"],
                "from_stop_id":          leg["from_stop_id"],
                "to_stop_id":            leg["to_stop_id"],
                "origin_lat":            origin_lat,
                "origin_lon":            origin_lon,
                "dest_lat":              dest_lat,
                "dest_lon":              dest_lon,
                "start_time":            leg["start_time"],
                "end_time":              leg["end_time"],
                "ping_count":            leg["ping_count"],
                "predicted_mode":        result.predicted_mode,
                "confidence":            round(result.confidence, 4),
                "classification_method": result.method,
                "features":              {k: round(v, 4) for k, v in result.features.items()},
            })
        else:
            trip_legs_out.append({
                "leg_id":                  leg["leg_id"],
                "leg_type":                leg["leg_type"],
                "from_stop_id":            leg["from_stop_id"],
                "to_stop_id":              leg["to_stop_id"],
                "origin_lat":              origin_lat,
                "origin_lon":              origin_lon,
                "dest_lat":                dest_lat,
                "dest_lon":                dest_lon,
                "start_time":              leg["start_time"],
                "end_time":                leg["end_time"],
                "ping_count":              leg["ping_count"],
                "predicted_mode":          "UNKNOWN",
                "confidence":              0.0,
                "classification_method":   "classifier_error",
                "features":                {},
            })

    # ------------------------------------------------------------------
    # Step 5: Build and return the unified response
    # ------------------------------------------------------------------
    return {
        "user_id":            user_id,
        "total_pings":        len(pings),
        "analysis_timestamp": datetime.now(timezone.utc).isoformat(),
        "stops":              stops_out,
        "trip_legs":          trip_legs_out,
        "summary": {
            "stop_count":    len(stops_out),
            "leg_count":     len(trip_legs_out),
            "modes_detected": sorted(set(modes_seen)),
        },
    }


# ---------------------------------------------------------------------------
# Itinerary Generation — POST /api/ml/generate-itinerary
# ---------------------------------------------------------------------------


class ItineraryRequest(BaseModel):
    """Request body for POST /api/ml/generate-itinerary."""

    user_request: str = Field(
        ...,
        min_length=5,
        description=(
            "Natural-language travel preference. "
            "E.g. 'peaceful nature trip with wildlife and backwaters'"
        ),
    )
    num_days: int = Field(
        default=3,
        ge=1,
        le=7,
        description="Number of days in the itinerary (1–7).",
    )
    top_k_spots: int = Field(
        default=6,
        ge=2,
        le=12,
        description="Number of spots to retrieve from the knowledge base.",
    )


@app.post("/api/ml/generate-itinerary")
def generate_itinerary(request: ItineraryRequest):
    """Generate a personalised Kerala trip itinerary using RAG + Gemini.

    Flow
    ----
    1. Call search_spots(user_request) to retrieve semantically relevant
       Kerala locations from the ChromaDB knowledge base.
    2. Inject those verified locations into a Gemini system prompt,
       grounding the LLM in real coordinates and descriptions.
    3. Call Gemini (gemini-2.0-flash) with JSON mode enforced.
    4. Validate the response schema and return the structured itinerary.

    Request Body
    ------------
    {
        "user_request": "peaceful nature trip with wildlife and backwaters",
        "num_days": 3,
        "top_k_spots": 6
    }

    Response Schema
    ---------------
    {
        "itinerary_title": str,
        "destination":     "Kerala, India",
        "total_days":      int,
        "summary":         str,
        "days": [
            {
                "day":   int,
                "theme": str,
                "activities": [
                    {
                        "time":           str,
                        "location_name":  str,
                        "description":    str,
                        "lat":            float,
                        "lon":            float,
                        "duration_hours": float
                    }
                ]
            }
        ],
        "spots_used": [
            { "rank": int, "name": str, "score": float, "lat": float, "lon": float, "district": str }
        ]
    }
    """
    logger.info(
        "generate_itinerary: request='%s' | days=%d | top_k=%d",
        request.user_request, request.num_days, request.top_k_spots,
    )

    try:
        result = generate_trip_plan(
            user_request=request.user_request,
            num_days=request.num_days,
            top_k_spots=request.top_k_spots,
        )
        return result.to_dict()

    except RuntimeError as exc:
        # Covers: GEMINI_API_KEY not set, KB not initialised, API call failure
        err_msg = str(exc)
        if "GEMINI_API_KEY" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API key is not configured. Set GEMINI_API_KEY in ml_service/.env.",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Itinerary generation failed: {err_msg}",
        )

    except ValueError as exc:
        # Covers: empty request string, LLM schema validation errors
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid request or LLM response: {exc}",
        )

    except Exception as exc:
        logger.exception("generate_itinerary: unexpected error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {exc}",
        )
