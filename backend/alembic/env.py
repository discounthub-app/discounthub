import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Добавляем путь к backend/app/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

from database import Base  # ✅ импорт без "app." — мы уже внутри неё

config = context.config
fileConfig(config.config_file_name)

# Берём URL БД из переменной окружения (или Docker переменных)
config.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL'))

target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()
