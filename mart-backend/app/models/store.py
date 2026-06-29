from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_no: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    store_addr: Mapped[str] = mapped_column(Text, nullable=False)
    store_city_id: Mapped[int] = mapped_column(Integer, ForeignKey("cities.id", ondelete="RESTRICT"), nullable=False)

    city: Mapped["City"] = relationship("City", back_populates="stores")  # type: ignore
