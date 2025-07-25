from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "DiscountHub"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True

    postgres_db: str
    postgres_user: str
    postgres_password: str
    postgres_host: str
    postgres_port: int

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    class Config:
        env_file = ".env"


settings = Settings()
