from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Seller
from app.schemas.seller import SellerCreate, Seller as SellerSchema

router = APIRouter(
    prefix="/sellers",
    tags=["sellers"]
)

@router.post("/", response_model=SellerSchema)
def create_seller(seller: SellerCreate, db: Session = Depends(get_db)):
    db_seller = Seller(name=seller.name)
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller

@router.get("/", response_model=list[SellerSchema])
def read_sellers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Seller).offset(skip).limit(limit).all()
