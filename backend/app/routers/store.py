from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/stores", tags=["Stores"])


@router.post("/", response_model=schemas.store.StoreOut)
def create_store(store: schemas.store.StoreCreate, db: Session = Depends(get_db)):
    db_store = models.store.Store(**store.dict())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


@router.get("/", response_model=list[schemas.store.StoreOut])
def get_stores(db: Session = Depends(get_db)):
    return db.query(models.store.Store).all()


@router.get("/{store_id}", response_model=schemas.store.StoreOut)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(models.store.Store).get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.put("/{store_id}", response_model=schemas.store.StoreOut)
def update_store(store_id: int, updated: schemas.store.StoreUpdate, db: Session = Depends(get_db)):
    store = db.query(models.store.Store).get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    for key, value in updated.dict().items():
        setattr(store, key, value)
    db.commit()
    db.refresh(store)
    return store


@router.delete("/{store_id}")
def delete_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(models.store.Store).get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    db.delete(store)
    db.commit()
    return {"message": "Store deleted"}
