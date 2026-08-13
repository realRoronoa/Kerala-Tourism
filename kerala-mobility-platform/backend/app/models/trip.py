from datetime import datetime
from typing import Optional
from app.database.connection import Base

try:
    from sqlalchemy import String, Float, DateTime, Boolean, Integer  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import Mapped, mapped_column  # type: ignore # pyrefly: ignore [missing-import]
except Exception:
    String = Float = DateTime = Boolean = Integer = object  # type: ignore # pyrefly: ignore [missing-import]
    Mapped = object  # type: ignore # pyrefly: ignore [missing-import]
    def mapped_column(*args, **kwargs): return None  # type: ignore # pyrefly: ignore [missing-import]

class Trip(Base):  # type: ignore # pyrefly: ignore [missing-import]
    __tablename__ = "trips"

    id = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)  # type: ignore
    user_id = mapped_column(String, index=True, nullable=False)  # type: ignore
    origin_lat = mapped_column(Float, nullable=False)  # type: ignore
    origin_lon = mapped_column(Float, nullable=False)  # type: ignore
    dest_lat = mapped_column(Float, nullable=False)  # type: ignore
    dest_lon = mapped_column(Float, nullable=False)  # type: ignore
    start_time = mapped_column(DateTime, nullable=False)  # type: ignore
    end_time = mapped_column(DateTime, nullable=False)  # type: ignore
    predicted_mode = mapped_column(String, nullable=False)  # type: ignore
    verified_mode = mapped_column(String, nullable=True)  # type: ignore
    purpose = mapped_column(String, nullable=True)  # type: ignore
    is_verified = mapped_column(Boolean, default=False, nullable=False)  # type: ignore
