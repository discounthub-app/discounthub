from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db import Base

class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint('user_id', 'discount_id', name='_user_discount_uc'),)

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discount_id = Column(Integer, ForeignKey("discounts.id"), nullable=False)

    user = relationship("User", back_populates="favorites")
    discount = relationship("Discount", back_populates="favorites")
