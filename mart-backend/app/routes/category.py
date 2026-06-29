from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["Categories"])


class CategoryIn(BaseModel):
    category_name: str
    cat_img: str | None = None
    parent_category_id: int | None = None

class CategoryOut(BaseModel):
    id: int
    category_name: str
    cat_img: str | None
    parent_category_id: int | None
    parent_name: str | None = None
    model_config = {"from_attributes": True}

def _to_out(c: Category) -> CategoryOut:
    return CategoryOut(
        id=c.id,
        category_name=c.category_name,
        cat_img=c.cat_img,
        parent_category_id=c.parent_category_id,
        parent_name=c.parent.category_name if c.parent else None,
    )


@router.get("/", response_model=list[CategoryOut])
def list_categories(
    parent_id: int | None = None,
    top_level_only: bool = False,
    db: Session = Depends(get_db),
):
    """Public — list all, or filter by parent, or top-level only."""
    q = db.query(Category)
    if top_level_only:
        q = q.filter(Category.parent_category_id == None)  # noqa: E711
    elif parent_id is not None:
        q = q.filter(Category.parent_category_id == parent_id)
    return [_to_out(c) for c in q.order_by(Category.category_name).all()]


@router.get("/{cat_id}", response_model=CategoryOut)
def get_category(cat_id: int, db: Session = Depends(get_db)):
    c = db.query(Category).filter(Category.id == cat_id).first()
    if not c:
        raise HTTPException(404, "Category not found")
    return _to_out(c)


@router.post("/", response_model=CategoryOut, status_code=201)
def create_category(body: CategoryIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    if body.parent_category_id:
        if not db.query(Category).filter(Category.id == body.parent_category_id).first():
            raise HTTPException(400, "Parent category not found")
    c = Category(**body.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return _to_out(c)


@router.put("/{cat_id}", response_model=CategoryOut)
def update_category(cat_id: int, body: CategoryIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(Category).filter(Category.id == cat_id).first()
    if not c:
        raise HTTPException(404, "Category not found")
    if body.parent_category_id == cat_id:
        raise HTTPException(400, "Category cannot be its own parent")
    for k, v in body.model_dump().items():
        setattr(c, k, v)
    db.commit(); db.refresh(c)
    return _to_out(c)


@router.delete("/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(Category).filter(Category.id == cat_id).first()
    if not c:
        raise HTTPException(404, "Category not found")
    db.delete(c); db.commit()
    return {"message": "Deleted"}
