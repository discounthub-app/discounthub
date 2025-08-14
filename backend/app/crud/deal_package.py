from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models import DealPackage
from app.schemas.deal_package import DealPackageCreate, DealPackageUpdate


def get(db: Session, deal_package_id: int) -> Optional[DealPackage]:
    return db.query(DealPackage).filter(DealPackage.id == deal_package_id).first()


def get_multi(db: Session, skip: int = 0, limit: int = 50) -> Tuple[List[DealPackage], int]:
    q = db.query(DealPackage)
    total = q.count()
    items = q.order_by(DealPackage.id.desc()).offset(skip).limit(limit).all()
    return items, total


def create(db: Session, obj_in: DealPackageCreate) -> DealPackage:
    obj = DealPackage(**obj_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update(db: Session, db_obj: DealPackage, obj_in: DealPackageUpdate) -> DealPackage:
    data = obj_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def remove(db: Session, deal_package_id: int) -> Optional[DealPackage]:
    obj = get(db, deal_package_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
