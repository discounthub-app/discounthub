from sqlalchemy.orm import Session
from app.models.seller import Seller
from app.schemas.seller import SellerCreate


def create_seller(db: Session, seller: SellerCreate) -> Seller:
    db_seller = Seller(name=seller.name)
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller


def get_sellers(db: Session):
    return db.query(Seller).all()


def get_seller(db: Session, seller_id: int):
    return db.query(Seller).filter(Seller.id == seller_id).first()
