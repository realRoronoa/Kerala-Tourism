from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine, Base, SessionLocal
from app.models.trip import Trip  # Ensure models are registered in metadata
from app.models.user import User
from app.database.init_db import seed_database
from app.api.routes import location, trips, analytics, auth, itinerary


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create database tables on startup
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial DB admin user and demo trips
    if SessionLocal:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(location.router, prefix="/api/v1/location", tags=["Location"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Trips"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(itinerary.router, prefix="/api/v1/itinerary", tags=["AI Itinerary Generator"])


@app.get("/")
def root_health_check():
    return {"message": "NATPAC Mobility Backend API is Running"}


@app.get("/api/v1/health")
def detailed_system_health():
    db_status = "connected" if SessionLocal else "disconnected"
    return {
        "status": "online",
        "service": "NATPAC Kerala Mobility System",
        "components": {
            "postgresql_postgis_db": db_status,
            "redis_ingestion_queue": "ready",
            "ml_inference_microservice": settings.ML_SERVICE_URL,
            "firebase_admin_authentication": "active"
        }
    }
