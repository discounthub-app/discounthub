from sqlalchemy import Column, Integer, String
from app.database import Base

class Seller(Base):
    __tablename__ = "sellers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=True)  # ✅ добавлено новое поле
