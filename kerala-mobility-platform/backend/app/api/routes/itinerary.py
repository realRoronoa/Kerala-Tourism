from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
import httpx
from app.core.config import settings
from app.schemas.itinerary import ItineraryRequestSchema

router = APIRouter()


@router.post("/generate")
async def generate_tourist_itinerary(payload: ItineraryRequestSchema):
    """
    Proxies AI-powered tourist itinerary generation to the ML Microservice
    rag_itinerary pipeline (`POST /api/ml/generate-itinerary`).
    """
    url = f"{settings.ML_SERVICE_URL}/api/ml/generate-itinerary"
    timeout = httpx.Timeout(20.0, connect=5.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            response = await client.post(url, json=payload.model_dump())
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="ML Itinerary generator timed out."
            )
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"ML service returned error: {exc.response.text}"
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Could not connect to ML service: {exc}"
            )


@router.get("/spots")
async def get_kerala_tourist_spots():
    """
    Fetches the 134 verified Kerala tourist spots dataset from the ML Microservice (`GET /api/ml/spots`).
    """
    url = f"{settings.ML_SERVICE_URL}/api/ml/spots"
    timeout = httpx.Timeout(10.0, connect=5.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed fetching Kerala tourist spots: {exc}"
            )
