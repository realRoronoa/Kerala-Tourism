try:
    from pydantic_settings import BaseSettings  # type: ignore # pyrefly: ignore [missing-import]
except ImportError:
    try:
        from pydantic.v1 import BaseSettings  # type: ignore # pyrefly: ignore [missing-import]
    except ImportError:
        from pydantic import BaseModel as BaseSettings  # type: ignore # pyrefly: ignore [missing-import]


class Settings(BaseSettings):
    PROJECT_NAME: str = "Kerala Mobility Platform"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/kerala_mobility"
    REDIS_URL: str = "redis://localhost:6379/0"
    ML_SERVICE_URL: str = "http://localhost:8001"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
