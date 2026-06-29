from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    OTPResponse,
    OTPVerifyRequest,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    UserProfile,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Step 1 – Submit registration details.
    Returns an OTP (dev_otp visible in response; use email in production).
    """
    return auth_service.register_user(db, payload)


@router.post("/verify-otp", response_model=OTPResponse)
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    """
    Step 2 – Verify the OTP received after registration.
    """
    return auth_service.verify_registration_otp(db, payload.email, payload.otp)


@router.post("/complete-registration", status_code=201)
def complete_registration(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Step 3 – After OTP verification, finalise the account creation.
    Re-send the same payload used in /register.
    """
    return auth_service.complete_registration(db, payload)


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Login with email + password. Returns a JWT bearer token."""
    return auth_service.login_user(db, payload)


@router.post("/forgot-password", response_model=OTPResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send an OTP to the registered email for password reset."""
    return auth_service.forgot_password(db, payload.email)


@router.post("/reset-password", response_model=OTPResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verify OTP and set a new password."""
    return auth_service.reset_password(db, payload)


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    """Fetch logged-in user's profile (requires Bearer token)."""
    return UserProfile(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        mobile=current_user.mobile,
        is_email_verified=current_user.is_email_verified,
        is_mobile_verified=current_user.is_mobile_verified,
        role=current_user.role.role_name,
    )
