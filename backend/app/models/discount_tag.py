from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db import Base

class DiscountTag(Base):
    __tablename__ = "discount_tags"
    __table_args__ = (UniqueConstraint('discount_id', 'tag_id', name='_discount_tag_uc'),)

    id = Column(Integer, primary_key=True)
    discount_id = Column(Integer, ForeignKey("discounts.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)

    discount = relationship("Discount", back_populates="tags")
    tag = relationship("Tag", back_populates="discounts")
