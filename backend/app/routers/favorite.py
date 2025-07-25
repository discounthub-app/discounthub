from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteCreate, FavoriteOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.post("/", response_model=FavoriteOut, status_code=201)
def add_favorite(favorite: FavoriteCreate, db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter_by(
        user_id=favorite.user_id,
        discount_id=favorite.discount_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    db_fav = Favorite(**favorite.model_dump())
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav


@router.get("/", response_model=list[FavoriteOut])
def list_favorites(db: Session = Depends(get_db)):
    return db.query(Favorite).all()


@router.delete("/", status_code=204)
def remove_favorite(favorite: FavoriteCreate, db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter_by(
        user_id=favorite.user_id,
        discount_id=favorite.discount_id
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in favorites")
    db.delete(fav)
    db.commit()
