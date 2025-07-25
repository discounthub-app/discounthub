from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.tag import TagCreate, TagOut
from app.crud import tag as crud

router = APIRouter(prefix="/tags", tags=["tags"])


@router.post("/", response_model=TagOut)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    existing_tag = crud.get_tag_by_name(db, tag.name)
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    return crud.create_tag(db, tag)


@router.get("/", response_model=list[TagOut])
def read_tags(db: Session = Depends(get_db)):
    return crud.get_tags(db)
