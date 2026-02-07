import google.generativeai as genai
from src.config import settings
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
             print("Warning: GEMINI_API_KEY not found in environment variables.")
             self.model = None
        else:
             try:
                genai.configure(api_key=self.api_key)
                # Using gemini-flash-latest to ensure we use the currently supported flash model
                self.model = genai.GenerativeModel('gemini-flash-latest')
             except Exception as e:
                print(f"Error configuring Gemini: {e}")
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
                 if os.getenv("MOCK_AI_ON_ERROR", "true").lower() == "true": # Default to true for better DX
                      return "Configuration Error: Gemini API Key is missing or invalid. Returning mock response. Please check your .env file."
                 raise Exception("Gemini API Key not configured and Mock Mode is disabled.")

            # Construct the full prompt
            full_prompt = ""
            if context:
                full_prompt += f"Here is the document context:\n{context}\n\n"
            
            full_prompt += f"User: {prompt}"

            # Generate content
            # The SDK supports async generation
            response = await self.model.generate_content_async(full_prompt)
            
            return response.text
        except Exception as e:
            error_str = str(e)
            print(f"Error calling AI service: {error_str}")
            
            # rate limit / quota check
            if "429" in error_str or "quota" in error_str.lower() or "ResourceExhausted" in error_str:
                return "AI Service is currently busy (Rate Limit Exceeded). Please try again in a few moments."

            # Check if we should fallback to mock on error
            if os.getenv("MOCK_AI_ON_ERROR", "true").lower() == "true":
                 print(f"Falling back to mock response due to error: {error_str}")
                 return f"I encountered an error interacting with Gemini. Error: {error_str}"
            
            raise e

# Singleton instance
ai_service = AIService()
