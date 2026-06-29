from pydantic import BaseModel, EmailStr, field_validator
import re


# ── Registration ──────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    password: str
    role_id: int = 3  # default: normal user

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v

    @field_validator("mobile")
    @classmethod
    def mobile_digits(cls, v: str) -> str:
        if not re.fullmatch(r"\d{10}", v):
            raise ValueError("Mobile must be exactly 10 digits")
        return v


class RegisterResponse(BaseModel):
    message: str
    email: str


# ── OTP ───────────────────────────────────────────────────────────────────────

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


class OTPResponse(BaseModel):
    message: str


# ── Login ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str


# ── Forgot / Reset password ───────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v


# ── Profile ───────────────────────────────────────────────────────────────────

class UserProfile(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    mobile: str
    is_email_verified: bool
    is_mobile_verified: bool
    role: str

    model_config = {"from_attributes": True}
