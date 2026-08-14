from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.api.deps import get_db
from app.models.trip import Trip
from datetime import datetime
from app.schemas.trip import TripResponseSchema, TripVerifySchema, TripCreateSchema

router = APIRouter()


@router.get("/unverified/{user_id}", response_model=List[TripResponseSchema])
def get_unverified_trips(user_id: str, db: Session = Depends(get_db)):
    """
    Query database for unverified trips belonging to a specific user.
    If no unverified trips exist for this specific user yet, return unverified trips from database.
    """
    stmt = select(Trip).where(Trip.user_id == user_id, Trip.is_verified == False)
    trips = db.scalars(stmt).all()
    if not trips:
        demo_stmt = select(Trip).where(Trip.is_verified == False)
        trips = db.scalars(demo_stmt).all()
    return trips


@router.post("/log", response_model=TripResponseSchema, status_code=status.HTTP_201_CREATED)
def log_trip(payload: TripCreateSchema, db: Session = Depends(get_db)):
    """
    Ingest a new detected/logged journey into PostgreSQL / Supabase.
    """
    new_trip = Trip(
        user_id=payload.user_id,
        origin_lat=payload.origin_lat,
        origin_lon=payload.origin_lon,
        dest_lat=payload.dest_lat,
        dest_lon=payload.dest_lon,
        start_time=payload.start_time or datetime.utcnow(),
        end_time=payload.end_time or datetime.utcnow(),
        predicted_mode=payload.predicted_mode or "Bus",
        confidence_score=payload.confidence_score or 0.85,
        purpose=payload.purpose or "Commute",
        is_verified=False
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@router.post("/verify", response_model=TripResponseSchema)
def verify_trip(payload: TripVerifySchema, db: Session = Depends(get_db)):
    """
    Accept user verification/correction for a trip, update record in PostgreSQL,
    mark is_verified = True, and commit.
    """
    stmt = select(Trip).where(Trip.id == payload.trip_id)
    trip = db.scalar(stmt)
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {payload.trip_id} not found."
        )

    trip.verified_mode = payload.corrected_mode
    if payload.purpose is not None:
        trip.purpose = payload.purpose
    trip.is_verified = True

    db.commit()
    db.refresh(trip)
    return trip

