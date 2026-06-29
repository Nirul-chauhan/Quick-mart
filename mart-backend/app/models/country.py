from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    country_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    states: Mapped[list["State"]] = relationship("State", back_populates="country")  # type: ignore
