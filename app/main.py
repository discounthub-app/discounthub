from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import discount, auth

app = FastAPI()

# Настройка CORS — разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для продакшена лучше указать конкретный адрес
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(discount.router, prefix="/discounts", tags=["Discounts"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
