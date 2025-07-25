from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.city import City
from app.schemas.city import CityCreate, CityOut

router = APIRouter(prefix="/cities", tags=["cities"])

@router.post("/", response_model=CityOut, status_code=201)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    db_city = City(**city.model_dump())
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

@router.get("/", response_model=list[CityOut])
def get_cities(db: Session = Depends(get_db)):
    return db.query(City).all()

@router.get("/{city_id}", response_model=CityOut)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).get(city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@router.delete("/{city_id}", status_code=204)
def delete_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).get(city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    db.delete(city)
    db.commit()
