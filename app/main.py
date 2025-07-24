from fastapi import FastAPI
from app.routers import discount

app = FastAPI()

# Подключаем роутеры
app.include_router(discount.router, prefix="/discounts", tags=["Discounts"])
