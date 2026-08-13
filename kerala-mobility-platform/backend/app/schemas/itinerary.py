from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ItineraryRequestSchema(BaseModel):
    user_request: str = Field(..., description="User's travel preference query (e.g. '3-day trip to Munnar and Alleppey for nature lovers')")
    days: Optional[int] = Field(default=3, ge=1, le=14)
    preferred_categories: Optional[List[str]] = Field(default_factory=list)
    origin_city: Optional[str] = "Kochi"


class ItineraryResponseSchema(BaseModel):
    status: str
    user_request: str
    itinerary: List[Dict[str, Any]]
    total_days: int
