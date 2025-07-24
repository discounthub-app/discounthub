from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.discount import DiscountCreate, DiscountOut
from ..crud.discount import create_discount, get_discounts
router = APIRouter(prefix="/discounts", tags=["discounts"])

@router.post("/", response_model=DiscountOut)
def create_new_discount(discount: DiscountCreate, db: Session = Depends(get_db)):
    return create_discount(db, discount)

@router.get("/", response_model=list[DiscountOut])
def read_discounts(db: Session = Depends(get_db)):
    return get_discounts(db)
