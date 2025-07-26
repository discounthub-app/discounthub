from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas
from app.dependencies.auth import get_current_user
from app.models.user import User  # если не импортирован

router = APIRouter(prefix="/discounts", tags=["Discounts"])


@router.post("/", response_model=schemas.discount.DiscountOut)
def create_discount(
    discount: schemas.discount.DiscountCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    db_discount = models.discount.Discount(**discount.model_dump())
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount


@router.get("/", response_model=list[schemas.discount.DiscountOut])
def get_discounts(db: Session = Depends(get_db)):
    return db.query(models.discount.Discount).all()


@router.get("/{discount_id}", response_model=schemas.discount.DiscountOut)
def get_discount(discount_id: int, db: Session = Depends(get_db)):
    discount = db.query(models.discount.Discount).get(discount_id)
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    return discount


@router.put("/{discount_id}", response_model=schemas.discount.DiscountOut)
def update_discount(discount_id: int, updated: schemas.discount.DiscountCreate, db: Session = Depends(get_db)):
    discount = db.query(models.discount.Discount).get(discount_id)
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    for key, value in updated.model_dump().items():
        setattr(discount, key, value)
    db.commit()
    db.refresh(discount)
    return discount


@router.delete("/{discount_id}")
def delete_discount(discount_id: int, db: Session = Depends(get_db)):
    discount = db.query(models.discount.Discount).get(discount_id)
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    db.delete(discount)
    db.commit()
    return {"message": "Discount deleted"}
