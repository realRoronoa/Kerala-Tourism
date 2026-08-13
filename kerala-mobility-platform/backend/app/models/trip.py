from datetime import datetime
from typing import Optional, Any
from app.database.connection import Base

try:
    from sqlalchemy import String, Float, DateTime, Boolean, Integer  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import Mapped, mapped_column  # type: ignore # pyrefly: ignore [missing-import]
except Exception:
    String = Float = DateTime = Boolean = Integer = object  # type: ignore
    class _Subscriptable:
        def __getitem__(self, item):
            return Any
    Mapped = _Subscriptable()  # type: ignore
    def mapped_column(*args, **kwargs): return None  # type: ignore

class Trip(Base):  # type: ignore
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)  # type: ignore
    user_id: Mapped[str] = mapped_column(String, index=True, nullable=False)  # type: ignore
    origin_lat: Mapped[float] = mapped_column(Float, nullable=False)  # type: ignore
    origin_lon: Mapped[float] = mapped_column(Float, nullable=False)  # type: ignore
    dest_lat: Mapped[float] = mapped_column(Float, nullable=False)  # type: ignore
    dest_lon: Mapped[float] = mapped_column(Float, nullable=False)  # type: ignore
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # type: ignore
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # type: ignore
    predicted_mode: Mapped[str] = mapped_column(String, nullable=False)  # type: ignore
    verified_mode: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # type: ignore
    purpose: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # type: ignore
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)  # type: ignore
