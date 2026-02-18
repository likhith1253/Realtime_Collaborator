from fastapi import FastAPI
from src.config import settings
from src.logger import logger
from src.health import router as health_router

app = FastAPI(title=settings.app_name)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(health_router, prefix="/ai")  # Add health check under /ai prefix
from src.routes import chat
app.include_router(chat.router, prefix="/ai")

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.app_name} on port {settings.port}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=settings.port, reload=True)
