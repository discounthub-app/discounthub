from fastapi import APIRouter

from .routes import users, products

router = APIRouter()
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(products.router, prefix="/products", tags=["Products"])
