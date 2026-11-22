
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.5-flash-lite"


def generate_response(message: str) -> str:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=message
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    return response.text
