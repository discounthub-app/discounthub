from sqlalchemy.orm import Session
from app.models.tag import Tag
from app.schemas.tag import TagCreate

def create_tag(db: Session, tag: TagCreate) -> Tag:
    db_tag = Tag(**tag.model_dump())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_tags(db: Session) -> list[Tag]:
    return db.query(Tag).all()

def get_tag_by_name(db: Session, name: str) -> Tag | None:
    return db.query(Tag).filter(Tag.name == name).first()
