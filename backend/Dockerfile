FROM python:3.11

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только backend в контейнер
COPY . .

# Устанавливаем зависимости
RUN pip install -r requirements.txt

# Запускаем FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
