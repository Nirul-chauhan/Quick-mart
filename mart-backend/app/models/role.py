from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    role_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # relationships
    users: Mapped[list["User"]] = relationship("User", back_populates="role")  # type: ignore[name-defined]
    user_roles: Mapped[list["UserRole"]] = relationship("UserRole", back_populates="role")  # type: ignore[name-defined]
