from typing import Generator
from app.core.config import settings

try:
    from sqlalchemy import create_engine  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import sessionmaker, DeclarativeBase  # type: ignore # pyrefly: ignore [missing-import]

    class Base(DeclarativeBase):  # type: ignore
        pass

    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception:
    class Base:  # type: ignore
        metadata = type("Metadata", (), {"create_all": lambda bind: None})()
    engine = None
    SessionLocal = None


def get_db() -> Generator:
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
