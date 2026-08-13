from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings


async def segment_stops(pings: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Asynchronously sends a batch of raw GPS pings to the external ML service for trip segmentation.
    """
    url = f"{settings.ML_SERVICE_URL}/segment-stops"
    timeout = httpx.Timeout(10.0, connect=5.0)
    
    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            response = await client.post(url, json={"pings": pings})
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException:
            print(f"[ML Client Warning] Request to ML service at {url} timed out.")
            return None
        except httpx.HTTPStatusError as exc:
            print(f"[ML Client Error] ML service returned status code {exc.response.status_code}.")
            return None
        except httpx.RequestError as exc:
            print(f"[ML Client Error] Network error occurred while connecting to ML service: {exc}")
            return None
