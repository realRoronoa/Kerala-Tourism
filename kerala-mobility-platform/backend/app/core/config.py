from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Kerala Mobility Platform"
    DATABASE_URL: str = "postgresql://postgres:postgrespassword@localhost:5432/kerala_mobility"
    REDIS_URL: str = "redis://localhost:6379/0"
    ML_SERVICE_URL: str = "http://localhost:8001"
    
    # Firebase Auth Credentials
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    FIREBASE_PROJECT_ID: Optional[str] = None

    # External APIs (Optional - Fallbacks to open endpoints if not provided)
    MAPBOX_API_KEY: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OPENROUTESERVICE_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

