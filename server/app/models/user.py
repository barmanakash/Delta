import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
#  Request Models
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    """Schema for user registration request."""

    full_name: str
    mobile: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        # Strip spaces and dashes, keep only digits
        cleaned = re.sub(r"[\s\-]", "", v)
        if not re.match(r"^\d{10}$", cleaned):
            raise ValueError("Mobile number must be exactly 10 digits")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least 1 number")
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, v: str, info) -> str:
        password = info.data.get("password")
        if password and v != password:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
#  Response Models
# ---------------------------------------------------------------------------

class IdDocumentInfo(BaseModel):
    """Metadata about an uploaded ID document (the file itself is never exposed)."""

    id_type: str  # aadhaar | driving | passport | voter
    original_filename: str
    content_type: str
    size: int
    uploaded_at: datetime
    status: str = "pending"  # pending | verified | rejected


class UserResponse(BaseModel):
    """User data returned in API responses (no password)."""

    id: str
    full_name: str
    mobile: str
    email: str
    created_at: datetime
    date_of_birth: Optional[str] = None  # ISO format: YYYY-MM-DD
    profile_photo_url: Optional[str] = None  # e.g. /uploads/profile_photos/<file>
    id_document: Optional[IdDocumentInfo] = None


class TokenResponse(BaseModel):
    """JWT token response after successful auth."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str
    detail: Optional[str] = None
