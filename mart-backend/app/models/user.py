from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    mobile: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_mobile_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), nullable=False)

    # relationships
    role: Mapped["Role"] = relationship("Role", back_populates="users")  # type: ignore[name-defined]
    user_roles: Mapped[list["UserRole"]] = relationship("UserRole", back_populates="user")  # type: ignore[name-defined]
