import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.logger import logger
from dotenv import load_dotenv

load_dotenv()

from src.config import settings

# Configure Gemini
api_key = settings.gemini_api_key
if not api_key:
    # This should technically be caught by Pydantic at startup, but good as a sanity check
    logger.error("GEMINI_API_KEY is not set in environment!")
else:
    logger.info(f"GEMINI_API_KEY is set (starts with {api_key[:5]}...)")

genai.configure(api_key=api_key)

# Using a slightly safer approach to model initialization
def get_model():
    # Using 'gemini-flash-latest' as it was verified to work in this environment
    # and handles quota/availability more reliably than specific version strings.
    model_name = "gemini-flash-latest"
    logger.info(f"Initializing Gemini model: {model_name}")
    return genai.GenerativeModel(model_name)

router = APIRouter()

class ChatRequest(BaseModel):
    userPrompt: str
    documentContent: str = ""

class ChatResponse(BaseModel):
    aiResponse: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    logger.info(f"Received chat request: prompt='{request.userPrompt}', doc_len={len(request.documentContent)}")
    
    try:
        # Construct the prompt
        prompt = request.userPrompt
        if request.documentContent:
            prompt = f"Document Context:\n{request.documentContent}\n\nUser Question: {request.userPrompt}"
        
        # Generate content
        model = get_model()
        # Use async version for FastAPI and disable safety filters for testing/flexibility if needed
        response = await model.generate_content_async(
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
            
        return ChatResponse(aiResponse=response.text)
        
    except Exception as e:
        logger.error(f"Gemini API error (type {type(e).__name__}): {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail="AI provider error"
        )
