import logging
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db import SessionLocal

# Роутеры
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
from app.routers.deal_packages import router as deal_packages_router  # NEW

# === ЛОГИРОВАНИЕ ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("discounthub")

# Нужен для корректного описания схемы авторизации в OpenAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(
    title="DiscountHub API",
    description="API для авторизации и управления скидками",
    version="1.0.0",
)

# === ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК ===
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error: %s", exc, exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# === СЧЁТЧИК ВСЕХ ЗАПРОСОВ (простая телеметрия) ===
request_counter = 0

@app.middleware("http")
async def count_requests(request: Request, call_next):
    global request_counter
    request_counter += 1
    response = await call_next(request)
    return response

@app.get("/metrics", tags=["Monitoring"])
def get_metrics() -> Dict[str, Any]:
    return {"total_requests": request_counter}

# === CORS middleware ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # при необходимости ограничьте доменами фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Подключение роутеров ===
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
app.include_router(deal_packages_router)  # NEW

# === Служебные эндпоинты ===
@app.get("/ping")
def ping():
    logger.info("Ping endpoint requested")
    return {"message": "pong"}

@app.get("/users/raw")
def get_users():
    db: Session = SessionLocal()
    try:
        rows = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
        logger.info("Requested raw users: %d found", len(rows))
        return rows
    finally:
        db.close()

# === Кастомные страницы документации ===
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="DiscountHub API")

@app.get("/api", include_in_schema=False)
async def custom_redoc_html():
    return get_redoc_html(openapi_url="/openapi.json", title="DiscountHub API – ReDoc")

# === Кастомная OpenAPI-схема с Bearer авторизацией ===
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="DiscountHub API",
        version="1.0.0",
        description="API для авторизации и управления скидками",
        routes=app.routes,
    )

    openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})["BearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }

    # По умолчанию помечаем методы как требующие Bearer; исключим публичные auth-эндпоинты
    public_paths = {("/auth/login", "post"), ("/auth/register", "post"), ("/ping", "get"), ("/metrics", "get")}
    for path, ops in openapi_schema.get("paths", {}).items():
        for method, spec in ops.items():
            if (path, method.lower()) in public_paths:
                continue
            spec.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
