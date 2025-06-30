from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.discount import DiscountCreate, DiscountOut
from app.models import Discount
from app.database import get_db

router = APIRouter(prefix="/discounts", tags=["Discounts"])

# ✅ Реальная выборка из БД
@router.get("/", response_model=list[DiscountOut])
def get_discounts(db: Session = Depends(get_db)):
    return db.query(Discount).all()

# ✅ Создание записи в БД
@router.post("/", response_model=DiscountOut)
def create_discount(discount: DiscountCreate, db: Session = Depends(get_db)):
    new_discount = Discount(
        title=discount.title,
        description=discount.description,
        price=discount.price,
        original_price=discount.original_price,
        seller_id=discount.seller_id,
        url=discount.url,
        image_url=discount.image_url
    )
    db.add(new_discount)
    db.commit()
    db.refresh(new_discount)
    return new_discount
