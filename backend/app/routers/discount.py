from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.discount import DiscountOut, DiscountCreate
from app.crud import discount as crud

router = APIRouter(
    prefix="/discounts",
    tags=["discounts"]
)

@router.post("/", response_model=DiscountOut)
def create_discount(discount: DiscountCreate, db: Session = Depends(get_db)):
    return crud.create_discount(db=db, discount=discount)

@router.get("/", response_model=list[DiscountOut])
def read_discounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_discounts(db=db, skip=skip, limit=limit)
