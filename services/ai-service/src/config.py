import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Service"
    port: int = 8000
    environment: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
