from datetime import datetime
from typing import Optional, Any
from app.database.connection import Base

try:
    from sqlalchemy import String, DateTime, Boolean, Integer  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import Mapped, mapped_column  # type: ignore # pyrefly: ignore [missing-import]
except Exception:
    String = DateTime = Boolean = Integer = object  # type: ignore
    class _Subscriptable:
        def __getitem__(self, item):
            return Any
    Mapped = _Subscriptable()  # type: ignore
    def mapped_column(*args, **kwargs): return None  # type: ignore

class User(Base):  # type: ignore
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)  # type: ignore
    device_token_hash: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)  # type: ignore
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)  # type: ignore
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # type: ignore
    preferred_language: Mapped[Optional[str]] = mapped_column(String, default="en", nullable=True)  # type: ignore
