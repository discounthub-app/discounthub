from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.discount import DiscountCreate, DiscountOut
from app.crud.discount import create_discount, get_discounts

router = APIRouter(
    prefix="/discounts",
    tags=["discounts"]
)

@router.post("/", response_model=DiscountOut)
def create_discount_view(discount: DiscountCreate, db: Session = Depends(get_db)):
    return create_discount(db=db, discount=discount)

@router.get("/", response_model=list[DiscountOut])
def read_discounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_discounts(db=db, skip=skip, limit=limit)
