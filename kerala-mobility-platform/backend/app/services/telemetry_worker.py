import json
from typing import List, Dict, Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings
from app.services.ml_client import segment_stops

QUEUE_KEY = "gps_telemetry_queue"


async def process_telemetry_queue(batch_size: int = 100) -> Optional[Dict[str, Any]]:
    """
    Background processor function that connects to Redis, pulls a batch of
    GPS pings from 'gps_telemetry_queue', formats them, and calls ml_client.
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

        # Send batch to ML service for trip segmentation
        result = await segment_stops(formatted_pings)

        # Trim processed elements from Redis queue
        await redis_client.ltrim(QUEUE_KEY, len(raw_pings), -1)

        return result
    except Exception as exc:
        print(f"[Telemetry Worker Error] Failed processing telemetry queue: {exc}")
        return None
    finally:
        await redis_client.aclose()
