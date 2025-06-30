from .database import Base, engine

# ВАЖНО: эти импорты должны быть ДО вызова create_all
from app.models.seller import Seller
from app.models.discount import Discount

def init_db():
    Base.metadata.create_all(bind=engine)
