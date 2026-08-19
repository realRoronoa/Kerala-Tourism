import json
import os
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
import httpx
from app.core.config import settings
from app.schemas.itinerary import ItineraryRequestSchema
from app.schemas.user import SendItineraryEmailRequest
from app.services.email_service import email_service

router = APIRouter()

# Path to the spots JSON dataset in backend database directory
_SPOTS_JSON_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "database", "kerala_spots.json")
)


def load_spots_dataset() -> List[Dict[str, Any]]:
    """
    Loads verified Kerala tourist spots dataset directly from backend storage.
    """
    if os.path.exists(_SPOTS_JSON_PATH):
        try:
            with open(_SPOTS_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading kerala_spots.json: {e}")
    
    # Secondary path check for ml_service dataset
    alt_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml_service", "app", "kerala_spots.json")
    )
    if os.path.exists(alt_path):
        with open(alt_path, "r", encoding="utf-8") as f:
            return json.load(f)

    return []


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
            ml_payload = {
                "user_request": payload.user_request,
                "num_days": payload.days,
                "top_k_spots": 6
            }
            response = await client.post(url, json=ml_payload)
            response.raise_for_status()
            return response.json()
        except Exception:
            # Smart fallback itinerary using real Kerala spots matching user preferences
            spots = load_spots_dataset()
            matched = [
                s for s in spots 
                if any(pref.lower() in [c.lower() for c in s.get("category", [])] for pref in payload.preferred_categories)
            ] if payload.preferred_categories else spots

            if not matched:
                matched = spots

            return {
                "status": "success",
                "days": payload.days,
                "interests": payload.preferences,
                "recommended_spots": matched[:payload.days * 2],
                "itinerary_summary": f"Customized {payload.days}-day Kerala travel plan covering {', '.join([s['name'] for s in matched[:3]])}."
            }


@router.post("/email-itinerary")
def email_tourist_itinerary(payload: SendItineraryEmailRequest, background_tasks: BackgroundTasks):
    """
    Sends the generated travel itinerary to the traveler's email inbox.
    """
    if not payload.email or "@" not in payload.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid email address is required."
        )

    itinerary_data = {
        "destination": payload.destination,
        "days": payload.days or []
    }

    background_tasks.add_task(
        email_service.send_itinerary_email, 
        payload.email, 
        itinerary_data, 
        payload.traveler_name
    )

    return {
        "status": "success",
        "message": f"Itinerary dispatched to {payload.email}."
    }


@router.get("/spots")
async def get_kerala_tourist_spots(
    preference: Optional[str] = Query(None, description="User interest preference (e.g. nature, beach, wildlife, mountains, peaceful, culture)")
):
    """
    Returns verified Kerala tourist spots dataset with optional preference filtering.
    """
    spots = load_spots_dataset()
    if preference:
        pref_lower = preference.lower().strip()
        filtered = [
            s for s in spots 
            if any(pref_lower in c.lower() for c in s.get("category", []))
            or pref_lower in s.get("name", "").lower()
            or pref_lower in s.get("district", "").lower()
        ]
        return filtered if filtered else spots

    return spots
