from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    original_price = Column(Float)
    seller_id = Column(Integer, ForeignKey("sellers.id"))  # Продавцы могут быть отдельной таблицей
    url = Column(String)
    image_url = Column(String)
