from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import schemas
from app.crud import discount as crud

router = APIRouter(
    prefix="/discounts",
    tags=["discounts"]
)

@router.post("/", response_model=schemas.DiscountOut)
def create_discount(discount: schemas.DiscountCreate, db: Session = Depends(get_db)):
    return crud.create_discount(db=db, discount=discount)

@router.get("/", response_model=list[schemas.DiscountOut])
def read_discounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_discounts(db=db, skip=skip, limit=limit)
