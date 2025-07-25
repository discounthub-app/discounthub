from sqlalchemy.orm import Session
from app.models.banner import Banner
from app.schemas.banner import BannerCreate

def create_banner(db: Session, banner_data: BannerCreate) -> Banner:
    banner = Banner(**banner_data.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner

def get_banners(db: Session) -> list[Banner]:
    return db.query(Banner).all()

def get_banner(db: Session, banner_id: int) -> Banner | None:
    return db.query(Banner).get(banner_id)

def delete_banner(db: Session, banner_id: int) -> None:
    banner = get_banner(db, banner_id)
    if banner:
        db.delete(banner)
        db.commit()
