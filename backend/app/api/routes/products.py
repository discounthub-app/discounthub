from fastapi import APIRouter
from app.schemas.products import ProductOut

router = APIRouter()

@router.get("/", response_model=list[ProductOut])
def get_products():
    return [{"id": 1, "name": "Пицца", "price": 499, "discount_price": 349}]
