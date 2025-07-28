from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db import get_db
from app import models, schemas
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/discounts", tags=["Discounts"])


@router.post("/", response_model=schemas.discount.DiscountOut)
def create_discount(
    discount: schemas.discount.DiscountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_discount = models.discount.Discount(**discount.model_dump())
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount


@router.get("/", response_model=List[schemas.discount.DiscountOut])
def get_discounts(
    db: Session = Depends(get_db),
    category_id: Optional[int] = Query(None, description="Фильтр по категории"),
    store_id: Optional[int] = Query(None, description="Фильтр по магазину"),
    query: Optional[str] = Query(None, description="Поиск по названию/описанию"),
    limit: int = Query(20, ge=1, le=100, description="Лимит записей"),
    offset: int = Query(0, ge=0, description="Смещение для пагинации"),
):
    q = db.query(models.discount.Discount)
    if category_id:
        q = q.filter(models.discount.Discount.category_id == category_id)
    if store_id:
        q = q.filter(models.discount.Discount.store_id == store_id)
    if query:
        q = q.filter(models.discount.Discount.title.ilike(f"%{query}%"))
    discounts = q.offset(offset).limit(limit).all()
    return discounts


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
