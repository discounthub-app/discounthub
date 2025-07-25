from fastapi import FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import SessionLocal
from app.routers.discount import router as discount_router
from app.routers.seller import router as seller_router
from app.routers.user import router as user_router
from app.routers.store import router as store_router
from app.routers.brand import router as brand_router
from app.routers.product import router as product_router
from app.routers.category import router as category_router
from app.routers.feedback import router as feedback_router  # ✅
from app.routers.user_profile import router as profile_router
from app.routers.banner import router as banner_router  # ✅
from app.routers.notification import router as notification_router
from app.routers.favorite import router as favorite_router

app = FastAPI()

# Подключение роутеров
app.include_router(discount_router)
app.include_router(seller_router)
app.include_router(user_router)
app.include_router(store_router)
app.include_router(brand_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(feedback_router)  # ✅
app.include_router(profile_router)
app.include_router(banner_router)  # ✅ Добавить эту строку
app.include_router(notification_router)
app.include_router(favorite_router)

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/users/raw")
def get_users():
    db: Session = SessionLocal()
    users = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
    return users
