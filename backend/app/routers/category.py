from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryOut
from app.dependencies.roles import require_admin  # <-- новое
from app.models.user import User  # тип для зависимости

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryOut, status_code=201)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),  # <-- только админ
):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/{category_id}", response_model=CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),  # <-- только админ
):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()

@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    updated: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),  # <-- только админ
):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in updated.model_dump().items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category
