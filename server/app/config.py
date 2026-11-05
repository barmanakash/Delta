import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# .../server
BASE_DIR = Path(__file__).resolve().parent.parent


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

    # Where uploaded files (profile photos) are stored on disk
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))
    PROFILE_PHOTO_SUBDIR: str = "profile_photos"
    MAX_PHOTO_BYTES: int = 5 * 1024 * 1024  # 5 MB

    # Government-ID documents are sensitive: they live in a SEPARATE folder that
    # is never mounted as static files, so they cannot be fetched by URL.
    PRIVATE_UPLOAD_DIR: str = os.getenv(
        "PRIVATE_UPLOAD_DIR", str(BASE_DIR / "private_uploads")
    )
    IDENTITY_DOC_SUBDIR: str = "identity_documents"
    MAX_ID_DOC_BYTES: int = 10 * 1024 * 1024  # 10 MB

    # ---- Payments (TEST MODE ONLY, no real money) ---------------------------
    # Where the React app lives: Stripe sends people back here after paying.
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    # Stripe TEST secret key (sk_test_...) from the Stripe dashboard. Live keys
    # (sk_live_...) are refused.
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "").strip()
    # Signing secret (whsec_...) of the webhook, so Stripe can tell this server a
    # payment succeeded even if the customer closes the tab. Optional.
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "").strip()


settings = Settings()
