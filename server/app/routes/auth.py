import uuid
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import EmailStr, TypeAdapter, ValidationError
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.database import get_users_collection
from app.models.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    MessageResponse,
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
#  Helper: convert a MongoDB user document to a UserResponse
# ---------------------------------------------------------------------------

def _user_response(user: dict) -> UserResponse:
    photo = user.get("profile_photo")
    photo_url = (
        f"/uploads/{settings.PROFILE_PHOTO_SUBDIR}/{photo}" if photo else None
    )
    return UserResponse(
        id=str(user["_id"]),
        full_name=user["full_name"],
        mobile=user["mobile"],
        email=user["email"],
        created_at=user["created_at"],
        date_of_birth=user.get("date_of_birth"),
        profile_photo_url=photo_url,
    )


# ---------------------------------------------------------------------------
#  POST /api/auth/register
# ---------------------------------------------------------------------------

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(payload: UserRegister):
    """
    Create a new user account.

    - Checks for duplicate email and mobile number.
    - Hashes the password with bcrypt.
    - Stores the user in MongoDB.
    - Returns a JWT access token.
    """
    users = get_users_collection()

    # Check duplicate email
    if await users.find_one({"email": payload.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Check duplicate mobile
    if await users.find_one({"mobile": payload.mobile}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this mobile number already exists",
        )

    # Build user document
    user_doc = {
        "full_name": payload.full_name,
        "mobile": payload.mobile,
        "email": payload.email,
        "password": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }

    result = await users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    # Create JWT token
    token = create_access_token({"sub": payload.email})

    return TokenResponse(
        access_token=token,
        user=_user_response(user_doc),
    )


# ---------------------------------------------------------------------------
#  POST /api/auth/login
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with email and password",
)
async def login(payload: UserLogin):
    """
    Authenticate an existing user.

    - Looks up the user by email.
    - Verifies the password against the stored bcrypt hash.
    - Returns a JWT access token.
    """
    users = get_users_collection()

    user = await users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": payload.email})

    return TokenResponse(
        access_token=token,
        user=_user_response(user),
    )


# ---------------------------------------------------------------------------
#  GET /api/auth/me
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the currently authenticated user's profile",
)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Return the profile of the user identified by the bearer token sent in
    the "Authorization" header. Used by the frontend to populate the
    profile page with the real signed-up user's data instead of hardcoded
    placeholders.
    """
    return _user_response(current_user)


# ---------------------------------------------------------------------------
#  PUT /api/auth/profile
# ---------------------------------------------------------------------------

def _detect_image_extension(data: bytes) -> Optional[str]:
    """
    Identify the image type from the file's actual bytes (magic numbers).
    The client-supplied filename / Content-Type are never trusted.
    """
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ".webp"
    return None


def _parse_date_of_birth(value: str) -> date:
    """Parse YYYY-MM-DD and enforce the 18+ rule."""
    try:
        dob = datetime.strptime(value.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Date of birth must be a valid date in YYYY-MM-DD format",
        )

    today = date.today()
    if dob > today:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Date of birth cannot be in the future",
        )

    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    if age < 18:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="You must be at least 18 years old",
        )
    if age > 120:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Enter a valid date of birth",
        )
    return dob


def _save_file(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def _delete_file(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass  # a leftover orphan file is harmless; never fail the request


@router.put(
    "/profile",
    response_model=TokenResponse,
    summary="Complete / update the current user's profile",
)
async def update_profile(
    full_name: str = Form(...),
    email: str = Form(...),
    date_of_birth: str = Form(..., description="YYYY-MM-DD"),
    photo: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    """
    Save the profile-step details (multipart/form-data).

    - Validates name, email, and date of birth (must be 18+).
    - A profile photo (JPG/PNG/WEBP, max 5 MB) is required the first time;
      afterwards it is optional and only replaces the old one if sent.
    - Stores the photo on disk and its filename + the DOB in MongoDB.
    - Returns a fresh JWT, because the token's subject is the email address
      and the email may have just changed.
    """
    users = get_users_collection()

    # ---- validate text fields -------------------------------------------
    full_name = full_name.strip()
    if len(full_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Full name must be at least 2 characters",
        )

    try:
        new_email = str(TypeAdapter(EmailStr).validate_python(email.strip())).lower()
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Enter a valid email address",
        )

    dob = _parse_date_of_birth(date_of_birth)

    if new_email != current_user["email"]:
        taken = await users.find_one(
            {"email": new_email, "_id": {"$ne": current_user["_id"]}}
        )
        if taken:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

    # ---- validate + store the photo -------------------------------------
    photo_dir = Path(settings.UPLOAD_DIR) / settings.PROFILE_PHOTO_SUBDIR
    old_photo = current_user.get("profile_photo")
    new_photo_name: Optional[str] = None

    if photo is not None and photo.filename:
        data = await photo.read(settings.MAX_PHOTO_BYTES + 1)
        if len(data) > settings.MAX_PHOTO_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Photo must be 5 MB or smaller",
            )
        extension = _detect_image_extension(data)
        if not extension:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Photo must be a JPG, PNG or WEBP image",
            )
        new_photo_name = f"{current_user['_id']}_{uuid.uuid4().hex}{extension}"
        await run_in_threadpool(_save_file, photo_dir / new_photo_name, data)
    elif not old_photo:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Profile photo is required",
        )

    # ---- persist --------------------------------------------------------
    update_fields = {
        "full_name": full_name,
        "email": new_email,
        "date_of_birth": dob.isoformat(),
        "profile_completed_at": datetime.now(timezone.utc),
    }
    if new_photo_name:
        update_fields["profile_photo"] = new_photo_name

    try:
        await users.update_one({"_id": current_user["_id"]}, {"$set": update_fields})
    except Exception:
        if new_photo_name:  # don't leave an orphan file behind
            await run_in_threadpool(_delete_file, photo_dir / new_photo_name)
        raise

    # Old photo is no longer referenced — remove it from disk
    if new_photo_name and old_photo:
        await run_in_threadpool(_delete_file, photo_dir / Path(old_photo).name)

    updated_user = await users.find_one({"_id": current_user["_id"]})

    return TokenResponse(
        access_token=create_access_token({"sub": new_email}),
        user=_user_response(updated_user),
    )
