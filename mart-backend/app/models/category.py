from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_name: Mapped[str] = mapped_column(String(150), nullable=False)
    cat_img: Mapped[str | None] = mapped_column(String(500), nullable=True)
    parent_category_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )

    # self-referential: parent ← children
    parent: Mapped["Category | None"] = relationship(
        "Category", remote_side="Category.id", back_populates="children"
    )
    children: Mapped[list["Category"]] = relationship(
        "Category", back_populates="parent"
    )
