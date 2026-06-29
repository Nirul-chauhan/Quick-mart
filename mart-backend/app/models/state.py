from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class State(Base):
    __tablename__ = "states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    state_name: Mapped[str] = mapped_column(String(100), nullable=False)
    country_id: Mapped[int] = mapped_column(Integer, ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False)

    country: Mapped["Country"] = relationship("Country", back_populates="states")  # type: ignore
    cities: Mapped[list["City"]] = relationship("City", back_populates="state")  # type: ignore
