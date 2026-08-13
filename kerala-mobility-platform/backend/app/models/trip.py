from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    origin_lat: Mapped[float] = mapped_column(Float, nullable=False)
    origin_lon: Mapped[float] = mapped_column(Float, nullable=False)
    dest_lat: Mapped[float] = mapped_column(Float, nullable=False)
    dest_lon: Mapped[float] = mapped_column(Float, nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    predicted_mode: Mapped[str] = mapped_column(String, nullable=False)
    confidence_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    verified_mode: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    purpose: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
