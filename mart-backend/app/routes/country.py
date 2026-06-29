from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.country import Country

router = APIRouter(prefix="/countries", tags=["Countries"])


class CountryIn(BaseModel):
    country_name: str

class CountryOut(BaseModel):
    id: int
    country_name: str
    model_config = {"from_attributes": True}


@router.get("/", response_model=list[CountryOut])
def list_countries(db: Session = Depends(get_db)):
    """Public — list all countries."""
    return db.query(Country).order_by(Country.country_name).all()


@router.get("/{country_id}", response_model=CountryOut)
def get_country(country_id: int, db: Session = Depends(get_db)):
    c = db.query(Country).filter(Country.id == country_id).first()
    if not c:
        raise HTTPException(404, "Country not found")
    return c


@router.post("/", response_model=CountryOut, status_code=201)
def create_country(body: CountryIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(Country).filter(Country.country_name == body.country_name).first():
        raise HTTPException(400, "Country already exists")
    c = Country(country_name=body.country_name)
    db.add(c); db.commit(); db.refresh(c)
    return c


@router.put("/{country_id}", response_model=CountryOut)
def update_country(country_id: int, body: CountryIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(Country).filter(Country.id == country_id).first()
    if not c:
        raise HTTPException(404, "Country not found")
    c.country_name = body.country_name
    db.commit(); db.refresh(c)
    return c


@router.delete("/{country_id}")
def delete_country(country_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = db.query(Country).filter(Country.id == country_id).first()
    if not c:
        raise HTTPException(404, "Country not found")
    db.delete(c); db.commit()
    return {"message": "Deleted"}
