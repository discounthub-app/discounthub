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
from app.routers.category import router as category_router  # ✅ добавляем это

app = FastAPI()

app.include_router(discount_router)
app.include_router(seller_router)
app.include_router(user_router)
app.include_router(store_router)
app.include_router(brand_router)
app.include_router(product_router)
app.include_router(category_router)  # ✅ теперь без ошибок




# 🔧 Тестовый маршрут для проверки работы API
@app.get("/ping")
def ping():
    return {"message": "pong"}

# 🧪 Пример прямого SQL-запроса (для отладки)
@app.get("/users/raw")
def get_users():
    db: Session = SessionLocal()
    users = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
    db.close()
    return users
