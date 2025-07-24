from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.user import UserCreate, UserOut
from app.crud import user as crud

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@router.get("/", response_model=list[UserOut])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)
