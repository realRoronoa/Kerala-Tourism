import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings
from app.database.connection import SessionLocal
from app.models.trip import Trip
from app.services.ml_client import analyze_trip

QUEUE_KEY = "gps_telemetry_queue"


def _parse_iso_datetime(value: Any) -> datetime:
    """Coerce string/timestamp to timezone-aware datetime."""
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            pass
    return datetime.now(timezone.utc)


async def process_telemetry_queue(batch_size: int = 100) -> Optional[Dict[str, Any]]:
    """
    Background processor function that connects to Redis, pulls a batch of
    GPS pings from 'gps_telemetry_queue', formats them, calls ml_client's
    '/api/ml/analyze-trip' endpoint, and persists valid trip legs into PostgreSQL.
    """
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    try:
        # Retrieve raw ping strings from Redis list queue
        raw_pings = await redis_client.lrange(QUEUE_KEY, 0, batch_size - 1)
        if not raw_pings:
            return None

        formatted_pings: List[Dict[str, Any]] = []
        for raw_ping in raw_pings:
            try:
                if isinstance(raw_ping, bytes):
                    raw_ping = raw_ping.decode('utf-8')
                formatted_pings.append(json.loads(raw_ping))
            except json.JSONDecodeError:
                continue

        if not formatted_pings:
            return None

        # 1. Send batch to ML service endpoint /api/ml/analyze-trip
        result = await analyze_trip(formatted_pings)

        if not result or "trip_legs" not in result:
            return result

        # 2. Extract user_id and trip_legs
        user_id = result.get("user_id", "anonymous_user")
        trip_legs = result.get("trip_legs", [])

        # 3. Filter and Insert valid trip legs into PostgreSQL
        inserted_trips = []
        if SessionLocal:
            db = SessionLocal()
            try:
                for leg in trip_legs:
                    predicted_mode = leg.get("predicted_mode")
                    
                    # Ignore leg if mode is UNKNOWN (insufficient pings / <2 pings)
                    if predicted_mode == "UNKNOWN":
                        continue

                    # Extract coordinates from leg pings if available
                    leg_pings = leg.get("pings", [])
                    if leg_pings:
                        origin_lat = float(leg_pings[0].get("lat", 0.0))
                        origin_lon = float(leg_pings[0].get("lon", 0.0))
                        dest_lat = float(leg_pings[-1].get("lat", 0.0))
                        dest_lon = float(leg_pings[-1].get("lon", 0.0))
                    else:
                        origin_lat = 0.0
                        origin_lon = 0.0
                        dest_lat = 0.0
                        dest_lon = 0.0

                    start_time = _parse_iso_datetime(leg.get("start_time"))
                    end_time = _parse_iso_datetime(leg.get("end_time"))
                    confidence_score = float(leg.get("confidence")) if leg.get("confidence") is not None else None

                    trip = Trip(
                        user_id=user_id,
                        origin_lat=origin_lat,
                        origin_lon=origin_lon,
                        dest_lat=dest_lat,
                        dest_lon=dest_lon,
                        start_time=start_time,
                        end_time=end_time,
                        predicted_mode=predicted_mode,
                        confidence_score=confidence_score,
                        verified_mode=None,
                        purpose=None,
                        is_verified=False
                    )
                    db.add(trip)
                    inserted_trips.append(trip)

                db.commit()
                print(f"[Telemetry Worker] Successfully saved {len(inserted_trips)} trip legs to PostgreSQL for user {user_id}")
            except Exception as exc:
                db.rollback()
                print(f"[Telemetry Worker DB Error] Failed inserting trips: {exc}")
            finally:
                db.close()

        # 4. Trim processed elements from Redis queue
        await redis_client.ltrim(QUEUE_KEY, len(raw_pings), -1)

        return result
    except Exception as exc:
        print(f"[Telemetry Worker Error] Failed processing telemetry queue: {exc}")
        return None
    finally:
        await redis_client.aclose()
