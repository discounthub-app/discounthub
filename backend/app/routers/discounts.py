from fastapi import APIRouter
from app.schemas.discount import DiscountCreate, DiscountOut
from app.models import Discount

router = APIRouter(prefix="/discounts", tags=["Discounts"])

@router.get("/", response_model=list[DiscountOut])
def get_discounts():
    return [
        {
            "id": 1,
            "title": "Скидка 1",
            "description": "Описание",
            "price": 99.99,
            "seller_id": 100,
            "url": "https://example.com"
        }
    ]
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db

@router.post("/", response_model=DiscountOut)
def create_discount(discount: DiscountCreate, db: Session = Depends(get_db)):
    new_discount = Discount(**discount.dict())
    db.add(new_discount)
    db.commit()
    db.refresh(new_discount)
    return new_discount
