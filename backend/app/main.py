from fastapi import FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import SessionLocal
from app.routers.discount import router as discount_router
from app.routers.seller import router as seller_router  # 👈 добавили

app = FastAPI()

# Подключаем router-ы
app.include_router(discount_router)
app.include_router(seller_router)  # 👈 добавили

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/users")
def get_users():
    db: Session = SessionLocal()
    users = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
    return users
