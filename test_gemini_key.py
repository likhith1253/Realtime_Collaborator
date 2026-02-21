import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env from the ai-service directory
load_dotenv('services/ai-service/.env')

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in services/ai-service/.env")
    exit(1)

print(f"Testing Gemini API Key: {api_key[:5]}...{api_key[-5:]}")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say 'Key is valid'")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"FAILURE: {str(e)}")
