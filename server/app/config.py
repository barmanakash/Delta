import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "saferoute")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY must be set in the environment")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )


settings = Settings()
