import json
import asyncio
from typing import Dict, Any
from app.core.config import settings

try:
    import redis.asyncio as aioredis  # type: ignore # pyrefly: ignore [missing-import]
except ImportError:
    aioredis = None


async def handle_mqtt_telemetry_message(topic: str, payload_bytes: bytes) -> None:
    """
    Subscribes to MQTT telemetry topic (e.g. 'kerala/telemetry/{device_id}'),
    parses JSON payload, and pushes ping into Redis queue for non-blocking worker processing.
    """
    if aioredis is None:
        print("[MQTT Worker Warning] Redis library unavailable.")
        return

    try:
        payload_str = payload_bytes.decode('utf-8')
        data = json.loads(payload_str)
        
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        try:
            await redis_client.rpush("gps_telemetry_queue", json.dumps(data))
            print(f"[MQTT Worker] Queued ping from topic {topic}")
        finally:
            await redis_client.aclose()
    except Exception as exc:
        print(f"[MQTT Worker Error] Failed processing MQTT message on topic {topic}: {exc}")
