from datetime import datetime
from typing import Optional
from app.database.connection import Base

try:
    from sqlalchemy import String, DateTime, Boolean, Integer  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import Mapped, mapped_column  # type: ignore # pyrefly: ignore [missing-import]
except Exception:
    String = DateTime = Boolean = Integer = object  # type: ignore # pyrefly: ignore [missing-import]
    Mapped = object  # type: ignore # pyrefly: ignore [missing-import]
    def mapped_column(*args, **kwargs): return None  # type: ignore # pyrefly: ignore [missing-import]

class User(Base):  # type: ignore # pyrefly: ignore [missing-import]
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)  # type: ignore
    device_token_hash = mapped_column(String, unique=True, index=True, nullable=False)  # type: ignore
    created_at = mapped_column(DateTime, default=datetime.utcnow, nullable=False)  # type: ignore
    is_active = mapped_column(Boolean, default=True, nullable=False)  # type: ignore
    preferred_language = mapped_column(String, default="en", nullable=True)  # type: ignore
