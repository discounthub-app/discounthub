from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandOut
from typing import List

router = APIRouter(prefix="/brands", tags=["Brands"])


@router.post("/", response_model=BrandOut)
def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    db_brand = Brand(name=brand.name)
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand


@router.get("/", response_model=List[BrandOut])
def get_all_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()


@router.get("/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand
