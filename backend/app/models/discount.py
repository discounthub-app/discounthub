from sqlalchemy import Column, Integer, String, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db import Base


class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)

    # Основные поля
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    old_price = Column(Float)

    # Связи с продавцом и продуктом
    seller_id = Column(Integer, ForeignKey("sellers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    seller = relationship("Seller", back_populates="discounts")
    product = relationship("Product", back_populates="discounts")

    # Дополнительные связи
    feedbacks = relationship("Feedback", back_populates="discount")
    tags = relationship("DiscountTag", back_populates="discount")
    favorites = relationship("Favorite", back_populates="discount", cascade="all, delete-orphan")

    # Геопозиция (для /discounts/nearby и геофильтров)
    latitude = Column(Float, nullable=True)   # -90..+90
    longitude = Column(Float, nullable=True)  # -180..+180

    # Индексы
    __table_args__ = (
        Index("ix_discounts_lat_lon", "latitude", "longitude"),
    )
