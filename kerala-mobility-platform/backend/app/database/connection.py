from typing import Generator
from app.core.config import settings

try:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker, DeclarativeBase

    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    class Base(DeclarativeBase):  # type: ignore
        pass
except ImportError:
    engine = None
    SessionLocal = None

    class Base:  # type: ignore
        metadata = type("Metadata", (), {"create_all": lambda bind: None})()


def get_db() -> Generator:
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
