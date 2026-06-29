from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.city import City
from app.models.store import Store

router = APIRouter(prefix="/stores", tags=["Stores"])


class StoreIn(BaseModel):
    store_no: str
    logo: str | None = None
    store_addr: str
    store_city_id: int

class StoreOut(BaseModel):
    id: int
    store_no: str
    logo: str | None
    store_addr: str
    store_city_id: int
    city_name: str | None = None
    state_name: str | None = None
    country_name: str | None = None
    model_config = {"from_attributes": True}

def _to_out(s: Store) -> StoreOut:
    city = s.city
    return StoreOut(
        id=s.id,
        store_no=s.store_no,
        logo=s.logo,
        store_addr=s.store_addr,
        store_city_id=s.store_city_id,
        city_name=city.city_name if city else None,
        state_name=city.state.state_name if city and city.state else None,
        country_name=city.state.country.country_name if city and city.state and city.state.country else None,
    )


@router.get("/", response_model=list[StoreOut])
def list_stores(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Service + User + Admin can view."""
    return [_to_out(s) for s in db.query(Store).order_by(Store.store_no).all()]


@router.get("/{store_id}", response_model=StoreOut)
def get_store(store_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    s = db.query(Store).filter(Store.id == store_id).first()
    if not s:
        raise HTTPException(404, "Store not found")
    return _to_out(s)


@router.post("/", response_model=StoreOut, status_code=201)
def create_store(body: StoreIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    if not db.query(City).filter(City.id == body.store_city_id).first():
        raise HTTPException(400, "City not found")
    if db.query(Store).filter(Store.store_no == body.store_no).first():
        raise HTTPException(400, "Store number already exists")
    s = Store(**body.model_dump())
    db.add(s); db.commit(); db.refresh(s)
    return _to_out(s)


@router.put("/{store_id}", response_model=StoreOut)
def update_store(store_id: int, body: StoreIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    s = db.query(Store).filter(Store.id == store_id).first()
    if not s:
        raise HTTPException(404, "Store not found")
    for k, v in body.model_dump().items():
        setattr(s, k, v)
    db.commit(); db.refresh(s)
    return _to_out(s)


@router.delete("/{store_id}")
def delete_store(store_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    s = db.query(Store).filter(Store.id == store_id).first()
    if not s:
        raise HTTPException(404, "Store not found")
    db.delete(s); db.commit()
    return {"message": "Deleted"}
