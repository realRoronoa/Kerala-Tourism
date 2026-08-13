from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine, Base
from app.models.trip import Trip  # Ensure models are registered in metadata
from app.api.routes import location, trips, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create database tables on startup
    Base.metadata.create_all(bind=engine)
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
app.include_router(location.router, prefix="/api/v1/location", tags=["Location"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Trips"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])


@app.get("/")
def root_health_check():
    return {"message": "NATPAC Mobility Backend API is Running"}
