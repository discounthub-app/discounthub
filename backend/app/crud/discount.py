from sqlalchemy.orm import Session
from app.models import discount as models
from app.schemas import discount as schemas


def get_discount(db: Session, discount_id: int):
    return db.query(models.Discount).filter(models.Discount.id == discount_id).first()


def get_discounts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Discount).offset(skip).limit(limit).all()


def create_discount(db: Session, discount: schemas.DiscountCreate):
    db_discount = models.Discount(
        title=discount.title,
        description=discount.description,
        price=discount.price,
        old_price=discount.old_price,
        seller_id=discount.seller_id,
        product_id=discount.product_id  # ✅ добавлено
    )
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount
