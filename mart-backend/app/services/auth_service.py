from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.role import Role
from app.models.user import User
from app.models.user_role import UserRole
from app.schemas.auth import (
    RegisterRequest, LoginRequest, ResetPasswordRequest
)
from app.services.otp_service import generate_otp, save_otp, verify_otp




# ── Registration ──────────────────────────────────────────────────────────────

def register_user(db: Session, payload: RegisterRequest) -> dict:
    # 1. Check email uniqueness
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # 2. Check mobile uniqueness
    if db.query(User).filter(User.mobile == payload.mobile).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered",
        )

    # 3. Validate role_id
    role = db.query(Role).filter(Role.id == payload.role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role ID {payload.role_id} does not exist",
        )

    # 4. Generate & save OTP (email not verified yet)
    otp = generate_otp()
    save_otp(db, payload.email, otp)

    # NOTE: In production, send the OTP via email / SMS.
    # Returning it in the response here for development purposes only.
    return {"message": "OTP sent to email", "email": payload.email, "dev_otp": otp}


def verify_registration_otp(db: Session, email: str, otp: str) -> dict:
    # Check OTP is valid
    if not verify_otp(db, email, otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )
    return {"message": "OTP verified. Complete registration.", "email": email}


def complete_registration(db: Session, payload: RegisterRequest) -> dict:
    """
    Called after OTP is verified. Creates the user and assigns the role.
    In the simple 2-step flow the client re-sends the full payload here.
    """
    # Guard: email must not already exist (idempotent re-call protection)
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    role = db.query(Role).filter(Role.id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role_id")

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        mobile=payload.mobile,
        password=hash_password(payload.password),
        is_email_verified=True,
        is_mobile_verified=False,
        role_id=payload.role_id,
    )
    db.add(user)
    db.flush()  # get user.id before committing

    db.add(UserRole(user_id=user.id, role_id=payload.role_id))
    db.commit()
    db.refresh(user)

    return {"message": "Registration successful", "user_id": user.id}


# ── Login ─────────────────────────────────────────────────────────────────────

def login_user(db: Session, payload: LoginRequest) -> dict:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your OTP first.",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.role_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role.role_name,
    }


# ── Forgot password ───────────────────────────────────────────────────────────

def forgot_password(db: Session, email: str) -> dict:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email",
        )
    otp = generate_otp()
    save_otp(db, email, otp)
    # NOTE: send otp via email in production
    return {"message": "OTP sent to email", "dev_otp": otp}


def reset_password(db: Session, payload: ResetPasswordRequest) -> dict:
    if not verify_otp(db, payload.email, payload.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password reset successfully"}
