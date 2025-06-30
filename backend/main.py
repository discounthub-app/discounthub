from fastapi import FastAPI
from app.api import router as api_router

app = FastAPI(title="DiscountHub API")

app.include_router(api_router)
from app.init_db import init_db

init_db()
