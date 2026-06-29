from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.country import Country
from app.models.state import State

router = APIRouter(prefix="/states", tags=["States"])


class StateIn(BaseModel):
    state_name: str
    country_id: int

class StateOut(BaseModel):
    id: int
    state_name: str
    country_id: int
    country_name: str | None = None
    model_config = {"from_attributes": True}

def _to_out(s: State) -> StateOut:
    return StateOut(
        id=s.id,
        state_name=s.state_name,
        country_id=s.country_id,
        country_name=s.country.country_name if s.country else None,
    )


@router.get("/", response_model=list[StateOut])
def list_states(country_id: int | None = None, db: Session = Depends(get_db)):
    q = db.query(State)
    if country_id:
        q = q.filter(State.country_id == country_id)
    return [_to_out(s) for s in q.order_by(State.state_name).all()]


@router.get("/{state_id}", response_model=StateOut)
def get_state(state_id: int, db: Session = Depends(get_db)):
    s = db.query(State).filter(State.id == state_id).first()
    if not s:
        raise HTTPException(404, "State not found")
    return _to_out(s)


@router.post("/", response_model=StateOut, status_code=201)
def create_state(body: StateIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    if not db.query(Country).filter(Country.id == body.country_id).first():
        raise HTTPException(400, "Country not found")
    s = State(state_name=body.state_name, country_id=body.country_id)
    db.add(s); db.commit(); db.refresh(s)
    return _to_out(s)


@router.put("/{state_id}", response_model=StateOut)
def update_state(state_id: int, body: StateIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    s = db.query(State).filter(State.id == state_id).first()
    if not s:
        raise HTTPException(404, "State not found")
    s.state_name = body.state_name
    s.country_id = body.country_id
    db.commit(); db.refresh(s)
    return _to_out(s)


@router.delete("/{state_id}")
def delete_state(state_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    s = db.query(State).filter(State.id == state_id).first()
    if not s:
        raise HTTPException(404, "State not found")
    db.delete(s); db.commit()
    return {"message": "Deleted"}
