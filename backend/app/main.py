from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer
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
from app.routers.feedback import router as feedback_router
from app.routers.user_profile import router as profile_router
from app.routers.banner import router as banner_router
from app.routers.notification import router as notification_router
from app.routers.favorite import router as favorite_router
from app.routers.tag import router as tag_router
from app.routers.city import router as city_router
from app.routers.region import router as region_router
from app.routers import auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(
    title="DiscountHub API",
    description="API для авторизации и управления скидками",
    version="1.0.0"
)

# Подключение роутеров
app.include_router(discount_router)
app.include_router(seller_router)
app.include_router(user_router)
app.include_router(store_router)
app.include_router(brand_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(feedback_router)
app.include_router(profile_router)
app.include_router(banner_router)
app.include_router(notification_router)
app.include_router(favorite_router)
app.include_router(tag_router)
app.include_router(region_router)
app.include_router(city_router)
app.include_router(auth.router)

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/users/raw")
def get_users():
    db: Session = SessionLocal()
    users = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
    return users

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="DiscountHub API")

# 👉 Кастомная OpenAPI-схема с Bearer авторизацией
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="DiscountHub API",
        version="1.0.0",
        description="API для авторизации и управления скидками",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
