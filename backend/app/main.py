from fastapi import FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import SessionLocal
from app.routers.discount import router as discount_router
from app.routers.seller import router as seller_router
from app.routers.user import router as user_router  # ✅ Роутер для пользователей
from app.routers.store import router as store_router

app = FastAPI()

# ✅ Подключение всех роутеров
app.include_router(discount_router)
app.include_router(seller_router)
app.include_router(user_router)
app.include_router(store_router)

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
