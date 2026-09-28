from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routes.auth import router as auth_router

app = FastAPI(
    title="SafeRoute API",
    description="Backend API for SafeRoute — Urban Two-Wheeler Lift-Sharing Platform",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
#  CORS — allow the React dev server at localhost:3000
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
#  Routers
# ---------------------------------------------------------------------------

app.include_router(auth_router)

# ---------------------------------------------------------------------------
#  Static files — uploaded profile photos are served from /uploads/...
# ---------------------------------------------------------------------------

(Path(settings.UPLOAD_DIR) / settings.PROFILE_PHOTO_SUBDIR).mkdir(
    parents=True, exist_ok=True
)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# ---------------------------------------------------------------------------
#  Health check
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": "SafeRoute API",
        "version": "1.0.0",
    }
