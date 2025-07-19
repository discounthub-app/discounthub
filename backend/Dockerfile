# Base image for backend (Python)

FROM python:3.11

WORKDIR /app
COPY . .

WORKDIR /app/backend  # 👈 ДОБАВЛЕНО

RUN pip install -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
