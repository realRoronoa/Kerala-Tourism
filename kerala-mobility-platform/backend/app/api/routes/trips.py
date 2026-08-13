from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_db
from app.models.trip import Trip
from app.schemas.trip import TripResponseSchema, TripVerifySchema

try:
    from sqlalchemy.orm import Session
    from sqlalchemy import select
except ImportError:
    Session = None  # type: ignore
    select = None  # type: ignore

router = APIRouter()


@router.get("/unverified/{user_id}", response_model=List[TripResponseSchema])
def get_unverified_trips(user_id: str, db: Session = Depends(get_db)):
    """
    Query database for unverified trips belonging to a specific user.
    """
    if db is None or select is None:
        return []
    stmt = select(Trip).where(Trip.user_id == user_id, Trip.is_verified == False)
    trips = db.scalars(stmt).all()
    return trips


@router.post("/verify", response_model=TripResponseSchema)
def verify_trip(payload: TripVerifySchema, db: Session = Depends(get_db)):
    """
    Accept user verification/correction for a trip, update record in PostgreSQL,
    mark is_verified = True, and commit.
    """
    if db is None or select is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database session unavailable."
        )

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
