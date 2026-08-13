from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.api.deps import get_db, get_current_admin
from app.models.trip import Trip
from app.models.user import User

router = APIRouter()


@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
) -> Dict[str, Any]:
    """
    Returns aggregated mobility intelligence summary for NATPAC government dashboards.
    Protected: Restricted strictly to NATPAC Administrators.
    """
    total_trips = db.scalar(select(func.count(Trip.id))) or 0
    verified_trips = db.scalar(select(func.count(Trip.id)).where(Trip.is_verified == True)) or 0
    unverified_trips = total_trips - verified_trips
    
    return {
        "total_trips": total_trips,
        "verified_trips": verified_trips,
        "unverified_trips": unverified_trips,
        "verification_rate": (verified_trips / total_trips) if total_trips > 0 else 0.0,
    }


@router.get("/mode-split")
def get_transport_mode_split(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Returns verified vs predicted transport mode share metrics across Kerala transit corridors.
    Protected: Restricted strictly to NATPAC Administrators.
    """
    stmt = (
        select(Trip.predicted_mode, func.count(Trip.id))
        .group_by(Trip.predicted_mode)
    )
    mode_counts = db.execute(stmt).all()
    return {"mode_split": {mode: count for mode, count in mode_counts}}

