from app.routers import sellers
from app.routers import discounts

from fastapi import FastAPI
from app.api import router as api_router

app = FastAPI(title="DiscountHub API")

app.include_router(sellers.router)


app.include_router(api_router)
app.include_router(discounts.router)

from app.init_db import init_db

init_db()
import sys
from app.init_db import init_db

if __name__ == "__main__":
    if "init_db" in sys.argv:
        init_db()
        print("✅ База данных инициализирована.")
