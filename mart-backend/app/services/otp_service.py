import random
import string

from sqlalchemy.orm import Session

from app.models.otp import OTP


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def save_otp(db: Session, email: str, otp: str) -> None:
    """Delete any existing OTP for the email, then save the new one."""
    db.query(OTP).filter(OTP.email == email).delete()
    db.add(OTP(email=email, otp=otp))
    db.commit()


def verify_otp(db: Session, email: str, otp: str) -> bool:
    """Return True and delete the record if OTP matches, else False."""
    record = db.query(OTP).filter(OTP.email == email, OTP.otp == otp).first()
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True
