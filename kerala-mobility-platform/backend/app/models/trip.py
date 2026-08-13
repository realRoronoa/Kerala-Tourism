from datetime import datetime
from typing import Optional
from app.database.connection import Base

try:
    from sqlalchemy import String, Float, DateTime, Boolean, Integer  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import Mapped, mapped_column  # type: ignore # pyrefly: ignore [missing-import]

    class Trip(Base):  # type: ignore
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
        verified_mode: Mapped[Optional[str]] = mapped_column(String, nullable=True)
        purpose: Mapped[Optional[str]] = mapped_column(String, nullable=True)
        is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
except ImportError:
    class Trip(Base):  # type: ignore
        pass
