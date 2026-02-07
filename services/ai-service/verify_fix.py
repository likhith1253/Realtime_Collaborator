import asyncio
import os
import logging
from src.services.ai import ai_service
from dotenv import load_dotenv

# Configure logging to suppress warnings
logging.basicConfig(level=logging.ERROR)
os.environ["GRPC_VERBOSITY"] = "ERROR"
os.environ["GLOG_minloglevel"] = "2"

load_dotenv()

async def main():
    print("Testing AI Service...")
    prompt = "Hello, tell me a one sentence joke."
    try:
        response = await ai_service.chat(prompt)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
