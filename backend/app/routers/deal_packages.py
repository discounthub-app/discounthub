from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.schemas.deal_package import (
    DealPackageCreate,
    DealPackageUpdate,
    DealPackageOut,
)
from app.crud import deal_package as crud_deal_package

# ⚠️ ВАЖНО: путь импорта get_db должен совпадать с вашим проектом.
# Если у вас иначе, замените на актуальный (например, from app.db.session import get_db).
from app.db import get_db

router = APIRouter(prefix="/deal-packages", tags=["deal-packages"])


@router.get("", response_model=list[DealPackageOut])
def list_deal_packages(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    items, _ = crud_deal_package.get_multi(db, skip=skip, limit=limit)
    return items


@router.get("/{deal_package_id}", response_model=DealPackageOut)
def get_deal_package(
    deal_package_id: int,
    db: Session = Depends(get_db),
):
    obj = crud_deal_package.get(db, deal_package_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DealPackage not found")
    return obj


@router.post("", response_model=DealPackageOut, status_code=status.HTTP_201_CREATED)
def create_deal_package(
    payload: DealPackageCreate,
    db: Session = Depends(get_db),
):
    return crud_deal_package.create(db, payload)


@router.patch("/{deal_package_id}", response_model=DealPackageOut)
def update_deal_package(
    deal_package_id: int,
    payload: DealPackageUpdate,
    db: Session = Depends(get_db),
):
    obj = crud_deal_package.get(db, deal_package_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DealPackage not found")
    return crud_deal_package.update(db, obj, payload)


@router.delete("/{deal_package_id}", response_model=DealPackageOut)
def delete_deal_package(
    deal_package_id: int,
    db: Session = Depends(get_db),
):
    obj = crud_deal_package.remove(db, deal_package_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DealPackage not found")
    return obj
