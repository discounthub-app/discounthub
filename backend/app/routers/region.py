from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.region import Region
from app.schemas.region import RegionCreate, RegionOut

router = APIRouter(prefix="/regions", tags=["regions"])

@router.post("/", response_model=RegionOut)
def create_region(region: RegionCreate, db: Session = Depends(get_db)):
    db_region = Region(**region.model_dump())
    db.add(db_region)
    db.commit()
    db.refresh(db_region)
    return db_region

@router.get("/", response_model=list[RegionOut])
def get_regions(db: Session = Depends(get_db)):
    return db.query(Region).all()

@router.get("/{region_id}", response_model=RegionOut)
def get_region(region_id: int, db: Session = Depends(get_db)):
    region = db.query(Region).get(region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region

@router.delete("/{region_id}", status_code=204)
def delete_region(region_id: int, db: Session = Depends(get_db)):
    region = db.query(Region).get(region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    db.delete(region)
    db.commit()
