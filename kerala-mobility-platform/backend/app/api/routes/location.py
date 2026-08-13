from fastapi import APIRouter, status, HTTPException
import redis.asyncio as aioredis
from app.core.config import settings
from app.schemas.trip import GPSPingSchema

router = APIRouter()


@router.post("/ping", status_code=status.HTTP_202_ACCEPTED)
async def receive_location_ping(ping: GPSPingSchema):
    """
    Accepts high-frequency GPS ping, serializes to JSON, and pushes to Redis queue immediately.
    Returns HTTP 202 Accepted.
    """
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    try:
        payload = ping.model_dump_json()
        await redis_client.rpush("gps_telemetry_queue", payload)
        return {"status": "accepted", "message": "Telemetry ping queued successfully"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to queue telemetry ping: {str(exc)}"
        )
    finally:
        await redis_client.aclose()
