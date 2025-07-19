# backend/Dockerfile

FROM python:3.11

WORKDIR /app

# Копируем все содержимое из backend
COPY . .

# Устанавливаем зависимости
RUN pip install -r requirements.txt

# Запускаем uvicorn, указывая путь к app.main
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
