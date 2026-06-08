import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.logger import logger
from dotenv import load_dotenv
from src.services.ai import ai_service

load_dotenv()

from src.config import settings

# Log startup diagnostics
if not settings.gemini_api_key:
    logger.warning("GEMINI_API_KEY not set - AI features disabled")
else:
    logger.info(f"GEMINI_API_KEY loaded ({len(settings.gemini_api_key)} chars)")
    
logger.info(f"AI Model: {settings.ai_model}")
logger.info(f"AI Service model initialized: {ai_service.model is not None}")

router = APIRouter()

class ChatRequest(BaseModel):
    userPrompt: str
    documentContent: str = ""

class ChatResponse(BaseModel):
    aiResponse: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    logger.info(f"Chat request: model={ai_service.model_name}, has_context={bool(request.documentContent)}")
    
    try:
        if not ai_service.model:
            logger.error("AI Service not initialized (no model)")
            raise HTTPException(status_code=503, detail="AI service not available")
        
        # Construct the prompt
        prompt = request.userPrompt
        if request.documentContent:
            prompt = f"Document Context:\n{request.documentContent}\n\nUser Question: {request.userPrompt}"
        
        # Generate content using singleton service
        response = await ai_service.model.generate_content_async(
            prompt,
            safety_settings={
                "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
                "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
                "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
                "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
            }
        )
        
        if not response.text:
            logger.error("Empty response from Gemini")
            raise Exception("Empty AI response")
            
        logger.info(f"Chat response success ({len(response.text)} chars)")
        return ChatResponse(aiResponse=response.text)
        
    except Exception as e:
        logger.error(f"Gemini API error: {type(e).__name__}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI provider error")
