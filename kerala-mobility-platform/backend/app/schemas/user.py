from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    email: str
    password: Optional[str] = "123456"
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class SendOTPRequest(BaseModel):
    identifier: str  # Email or 10-digit mobile number
    full_name: Optional[str] = None


class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str
    full_name: Optional[str] = None


class OTPResponse(BaseModel):
    message: str
    identifier: str
    delivery_channel: str
    dev_otp_preview: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    preferred_language: Optional[str] = "en"


class SendItineraryEmailRequest(BaseModel):
    email: str
    destination: str
    traveler_name: Optional[str] = None
    days: Optional[List[Dict[str, Any]]] = None


class FirebaseLoginRequest(BaseModel):
    id_token: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    role: str
    created_at: datetime
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None
