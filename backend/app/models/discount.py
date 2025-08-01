from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    old_price = Column(Float)

    seller_id = Column(Integer, ForeignKey("sellers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    seller = relationship("Seller", back_populates="discounts")
    product = relationship("Product", back_populates="discounts")

    feedbacks = relationship("Feedback", back_populates="discount")
    tags = relationship("DiscountTag", back_populates="discount")
    favorites = relationship("Favorite", back_populates="discount", cascade="all, delete-orphan")
