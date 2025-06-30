from .database import Base, engine
from .models import Discount

def init_db():
    Base.metadata.create_all(bind=engine)
from app.models.seller import Seller  # добавь это
from app.models.discount import Discount
