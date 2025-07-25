from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.banner import BannerCreate, BannerOut
from app.crud import banner as crud

router = APIRouter(prefix="/banners", tags=["banners"])

@router.post("/", response_model=BannerOut, status_code=201)
def create_banner(banner: BannerCreate, db: Session = Depends(get_db)):
    return crud.create_banner(db, banner)

@router.get("/", response_model=list[BannerOut])
def get_banners(db: Session = Depends(get_db)):
    return crud.get_banners(db)

@router.get("/{banner_id}", response_model=BannerOut)
def get_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = crud.get_banner(db, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner

@router.delete("/{banner_id}", status_code=204)
def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = crud.get_banner(db, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    crud.delete_banner(db, banner_id)
