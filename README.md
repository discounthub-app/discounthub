# 🛍️ DiscountHub

Платформа для агрегирования и отображения скидок от различных ритейлеров.

---

## 🚀 Быстрый старт

### 🔧 Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/discounthub-app/discounthub.git
cd discounthub
```

### 🔧 Шаг 2: Настройка переменных окружения

1. Скопируйте шаблон переменных окружения:

```bash
cp .env.example .env
```

2. Заполните `.env` своими значениями:

- `DJANGO_SECRET_KEY` — секретный ключ Django
- `DJANGO_DEBUG` — режим отладки (True/False)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — настройки базы данных
- `VITE_API_BASE_URL` — адрес backend API для frontend

### 🐳 Шаг 3: Запуск с Docker

```bash
docker-compose up --build
```

Проект будет доступен:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 📂 Структура проекта

```
.
├── backend/              # Django backend
├── frontend/             # Vite + React frontend
├── .env.example          # Шаблон переменных окружения
├── docker-compose.yml    # Конфигурация Docker Compose
└── README.md             # Инструкция
```

---

## 📄 Лицензия

Проект доступен под лицензией MIT.
