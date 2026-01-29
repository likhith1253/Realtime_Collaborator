from fastapi import FastAPI
from src.config import settings
from src.logger import logger
from src.health import router as health_router

app = FastAPI(title=settings.app_name)

app.include_router(health_router)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.app_name} on port {settings.port}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=settings.port, reload=True)
