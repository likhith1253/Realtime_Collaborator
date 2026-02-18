import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Service"
    port: int = 8001
    environment: str = "development"
    
    # Required variables (no default value = raises error if missing)
    gemini_api_key: str
    
    # Optional with defaults
    cors_origin: str = "http://localhost:3000"
    mock_ai: bool = False
    mock_ai_on_error: bool = True
    ai_model: str = "gemini-1.5-flash"

    class Config:
        env_file = ".env"
        # We want to error on missing required fields, so we don't use extra="ignore" 
        # unless we specifically want to allow unknown env vars (which is fine).
        # But for missing fields, Pydantic defaults to erroring which is what we want.
        extra = "ignore" 

settings = Settings()
