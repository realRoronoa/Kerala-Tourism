from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.security import get_password_hash
from app.models.user import User
from app.models.trip import Trip


def seed_database(db: Session) -> None:
    """
    Seeds initial admin account and sample unverified Kerala trips if DB is fresh.
    """
    # Seed NATPAC Admin User
    admin_stmt = select(User).where(User.email == "natpac_admin@kerala.gov.in")
    admin_user = db.scalar(admin_stmt)
    if not admin_user:
        admin_user = User(
            email="natpac_admin@kerala.gov.in",
            hashed_password=get_password_hash("admin123"),
            full_name="NATPAC Mobility Admin",
            role="natpac_admin"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

    # Seed Sample Kerala Trips
    trip_stmt = select(Trip)
    existing_trips = db.scalars(trip_stmt).all()
    if not existing_trips:
        sample_trips = [
            Trip(
                user_id="user_kerala_101",
                origin_lat=8.4875,
                origin_lon=76.9525,
                dest_lat=8.5581,
                dest_lon=76.8816,
                start_time=datetime.utcnow() - timedelta(hours=5),
                end_time=datetime.utcnow() - timedelta(hours=4, minutes=15),
                predicted_mode="Bus",
                is_verified=False
            ),
            Trip(
                user_id="user_kerala_101",
                origin_lat=9.9816,
                origin_lon=76.2999,
                dest_lat=10.0159,
                dest_lon=76.3419,
                start_time=datetime.utcnow() - timedelta(hours=3),
                end_time=datetime.utcnow() - timedelta(hours=2, minutes=30),
                predicted_mode="Auto/Two-Wheeler",
                is_verified=False
            ),
            Trip(
                user_id="user_kerala_102",
                origin_lat=11.2480,
                origin_lon=75.7839,
                dest_lat=11.2612,
                dest_lon=75.7686,
                start_time=datetime.utcnow() - timedelta(hours=2),
                end_time=datetime.utcnow() - timedelta(hours=1, minutes=45),
                predicted_mode="Walking",
                is_verified=False
            )
        ]
        db.add_all(sample_trips)
        db.commit()
