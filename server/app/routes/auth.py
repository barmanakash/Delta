from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
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
    return UserResponse(
        id=str(user["_id"]),
        full_name=user["full_name"],
        mobile=user["mobile"],
        email=user["email"],
        created_at=user["created_at"],
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
