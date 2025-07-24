from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.db import get_db
from app.crud import seller as crud

router = APIRouter(
    prefix="/sellers",
    tags=["sellers"]
)

@router.post("/", response_model=schemas.SellerOut)
def create_seller(seller: schemas.SellerCreate, db: Session = Depends(get_db)):
    return crud.create_seller(db, seller)

@router.get("/", response_model=list[schemas.SellerOut])
def read_sellers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sellers(db, skip=skip, limit=limit)
