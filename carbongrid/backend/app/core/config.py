from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonGrid"

    database_url: str = (
        "postgresql+psycopg://carbongrid:carbongrid@db:5432/carbongrid"
    )

    SECRET_KEY: str = "carbongrid-development-secret-change-this"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonGrid"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./carbongrid.db")

    class Config:
        env_file = ".env"

settings = Settings()