from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate, UserProfileOut
from app.crud import user_profile as crud

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("/", response_model=UserProfileOut, status_code=201)
def create_profile(profile: UserProfileCreate, db: Session = Depends(get_db)):
    return crud.create_user_profile(db=db, profile=profile)


@router.get("/{user_id}", response_model=UserProfileOut)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = crud.get_user_profile(db=db, user_id=user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/{user_id}", response_model=UserProfileOut)
def update_profile(user_id: int, updates: UserProfileUpdate, db: Session = Depends(get_db)):
    profile = crud.update_user_profile(db=db, user_id=user_id, updates=updates)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.delete("/{user_id}", status_code=204)
def delete_profile(user_id: int, db: Session = Depends(get_db)):
    profile = crud.delete_user_profile(db=db, user_id=user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
