from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.role import Role

router = APIRouter(prefix="/roles", tags=["Roles"])


class RoleOut(BaseModel):
    id: int
    role_name: str
    model_config = {"from_attributes": True}


@router.get("/", response_model=list[RoleOut])
def list_roles(db: Session = Depends(get_db)):
    """List all roles (public)."""
    return db.query(Role).all()


@router.post("/", response_model=RoleOut, status_code=201)
def create_role(
    role_name: str,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Create a new role (admin only)."""
    if db.query(Role).filter(Role.role_name == role_name).first():
        raise HTTPException(status_code=400, detail="Role already exists")
    role = Role(role_name=role_name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
