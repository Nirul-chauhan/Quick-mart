from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.city import City
from app.models.state import State

router = APIRouter(prefix="/cities", tags=["Cities"])


class CityIn(BaseModel):
    city_name: str
    state_id: int

class CityOut(BaseModel):
    id: int
    city_name: str
    state_id: int
    state_name: str | None = None
    country_name: str | None = None
    model_config = {"from_attributes": True}

def _to_out(c: City) -> CityOut:
    return CityOut(
        id=c.id,
        city_name=c.city_name,
        state_id=c.state_id,
        state_name=c.state.state_name if c.state else None,
        country_name=c.state.country.country_name if c.state and c.state.country else None,
    )


@router.get("/", response_model=list[CityOut])
def list_cities(state_id: int | None = None, db: Session = Depends(get_db)):
    q = db.query(City)
    if state_id:
        q = q.filter(City.state_id == state_id)
    return [_to_out(c) for c in q.order_by(City.city_name).all()]


@router.get("/{city_id}", response_model=CityOut)
def get_city(city_id: int, db: Session = Depends(get_db)):
    c = db.query(City).filter(City.id == city_id).first()
    if not c:
        raise HTTPException(404, "City not found")
    return _to_out(c)


@router.post("/", response_model=CityOut, status_code=201)
def create_city(body: CityIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    if not db.query(State).filter(State.id == body.state_id).first():
        raise HTTPException(400, "State not found")
    c = City(city_name=body.city_name, state_id=body.state_id)
    db.add(c); db.commit(); db.refresh(c)
    return _to_out(c)


@router.put("/{city_id}", response_model=CityOut)
def update_city(city_id: int, body: CityIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(City).filter(City.id == city_id).first()
    if not c:
        raise HTTPException(404, "City not found")
    c.city_name = body.city_name
    c.state_id = body.state_id
    db.commit(); db.refresh(c)
    return _to_out(c)


@router.delete("/{city_id}")
def delete_city(city_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(City).filter(City.id == city_id).first()
    if not c:
        raise HTTPException(404, "City not found")
    db.delete(c); db.commit()
    return {"message": "Deleted"}
