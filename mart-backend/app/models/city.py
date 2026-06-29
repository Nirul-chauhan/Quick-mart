from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class City(Base):
    __tablename__ = "cities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    city_name: Mapped[str] = mapped_column(String(100), nullable=False)
    state_id: Mapped[int] = mapped_column(Integer, ForeignKey("states.id", ondelete="RESTRICT"), nullable=False)

    state: Mapped["State"] = relationship("State", back_populates="cities")  # type: ignore
    stores: Mapped[list["Store"]] = relationship("Store", back_populates="city")  # type: ignore
