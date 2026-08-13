from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class GPSPingSchema(BaseModel):
    device_id: str
    lat: float
    lon: float
    speed: float
    timestamp: datetime


class TripResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str
    origin_lat: float
    origin_lon: float
    dest_lat: float
    dest_lon: float
    start_time: datetime
    end_time: datetime
    predicted_mode: str
    confidence_score: Optional[float] = None
    verified_mode: Optional[str] = None
    purpose: Optional[str] = None
    is_verified: bool = False


class TripVerifySchema(BaseModel):
    trip_id: int
    corrected_mode: str
    purpose: Optional[str] = None
