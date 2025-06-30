from sqlalchemy import Column, Integer, String
from .database import Base

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    store = Column(String)
    category = Column(String)
