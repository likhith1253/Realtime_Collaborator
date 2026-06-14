import google.generativeai as genai
from src.config import settings
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = settings.ai_model
        self.model = None
        
        if not self.api_key:
            print(f"[AIService] WARNING: GEMINI_API_KEY not found. AI will not work. Set GEMINI_API_KEY env var.")
        else:
            print(f"[AIService] INFO: GEMINI_API_KEY loaded (length: {len(self.api_key)} chars)")
            try:
                genai.configure(api_key=self.api_key)
                print(f"[AIService] INFO: Gemini configured with model: {self.model_name}")
                self.model = genai.GenerativeModel(self.model_name)
                print(f"[AIService] OK: Model initialized successfully")
            except Exception as e:
                print(f"[AIService] ERROR: Failed to initialize model: {e}")
                self.model = None

    async def chat(self, prompt: str, context: str = "") -> str:
        """
        Send a chat completion request to Google Gemini.
        """
        try:
            # Check for Mock Mode
            if os.getenv("MOCK_AI", "false").lower() == "true":
                import asyncio
                await asyncio.sleep(1) 
                return "I am a Mock AI Assistant (Gemini Mode). I can't really think, but I can help you test the UI! Your prompt was: " + prompt
            
            # Check if model is initialized
            if not self.model:
                 if os.getenv("MOCK_AI_ON_ERROR", "true").lower() == "true":
                      return "Configuration Error: Gemini API Key is missing or invalid. Returning mock response. Please check your .env file."
                 raise Exception("Gemini API Key not configured and Mock Mode is disabled.")

            # Construct the full prompt
            full_prompt = ""
            if context:
                full_prompt += f"Here is the document context:\n{context}\n\n"
            
            full_prompt += f"User: {prompt}"

            # Generate content
            response = await self.model.generate_content_async(full_prompt)
            
            return response.text
        except Exception as e:
            error_str = str(e)
            print(f"[AIService] ERROR: {error_str}")
            
            # rate limit / quota check
            if "429" in error_str or "quota" in error_str.lower() or "ResourceExhausted" in error_str:
                return "AI Service is currently busy (Rate Limit Exceeded). Please try again in a few moments."

            # Check if we should fallback to mock on error
            if os.getenv("MOCK_AI_ON_ERROR", "true").lower() == "true":
                 print(f"[AIService] Falling back to mock: {error_str}")
                 return f"I encountered an error interacting with Gemini. Error: {error_str}"
            
            raise e

# Singleton instance
ai_service = AIService()
