from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Параметры подключения из docker-compose.yml
DATABASE_URL = "postgresql://discounthub_user:secret123@db:5432/discounthub"

# Создаём движок
engine = create_engine(DATABASE_URL)

# Создаём сессию
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()
