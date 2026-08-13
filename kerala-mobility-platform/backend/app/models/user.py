from datetime import datetime
from typing import Optional
from app.database.connection import Base

try:
    from sqlalchemy import String, DateTime, Boolean, Integer
    from sqlalchemy.orm import Mapped, mapped_column

    class User(Base):  # type: ignore
        __tablename__ = "users"

        id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
        device_token_hash: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
        preferred_language: Mapped[Optional[str]] = mapped_column(String, default="en", nullable=True)
except ImportError:
    class User(Base):  # type: ignore
        pass
