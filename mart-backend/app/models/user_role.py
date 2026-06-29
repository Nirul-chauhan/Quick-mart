from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(Base):
    __tablename__ = "user_roles"

    user_role_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), nullable=False)

    # relationships
    user: Mapped["User"] = relationship("User", back_populates="user_roles")  # type: ignore[name-defined]
    role: Mapped["Role"] = relationship("Role", back_populates="user_roles")  # type: ignore[name-defined]
