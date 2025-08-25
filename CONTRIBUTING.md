# Contributing to DiscountHub

## Ветки
- `develop` — основная ветка разработки (защищена).
- Работы ведём через feature-ветки: `feature/<scope>`, `fix/<scope>`, `chore/<scope>`.

## Как оформить PR
1. Создать ветку от `develop`.
2. Коммиты: осмысленные, на английском (или русском), в едином стиле.
3. Открыть Pull Request → цель: `develop`.
4. Требования к PR:
   - все проверки CI зелёные (backend pytest, frontend build);
   - минимум 1 approve;
   - нет конфликтов.

## Коммит-месседжи
- `feat: ...` — новая функциональность
- `fix: ...` — исправление
- `chore: ...` — инфраструктура/обновления
- `docs: ...` — документация
- `test: ...` — тесты
- `refactor: ...` — рефакторинг без изменения поведения

## Локальный запуск
### Backend
- env: `.env.dev` (см. `.env.example` при появлении)
- `docker compose up -d app_db backend`
- Тесты: `docker compose exec backend pytest -q`

### Frontend (Vite)
- env: `.env.development` (`VITE_API_URL=http://127.0.0.1:8000`)
- `cd frontend && npm i && npm run dev | build`

## Код-стайл
- Backend: Pydantic v2, SQLAlchemy 2.x API, Alembic миграции.
- Frontend: React 18, Vite, Tailwind v4. Логи ошибок: `src/lib/logger.ts`.

## Безопасность
- CRUD на опасных ресурсах защищать ролями (`is_admin`).
- В `Out`-схемах не отдавать внутренние поля (пароли, хэши и т.п.).

## Ревью
- Маленькие PR приветствуются.
- Если PR «застаивается», используем «Dismiss stale approvals».
