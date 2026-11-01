import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

TINYFISH_API_KEY = os.getenv("TINYFISH_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
TINYFISH_BASE_URL = os.getenv("TINYFISH_BASE_URL", "https://agent.tinyfish.ai")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "127.0.0.1")
DB_PATH = os.getenv("DB_PATH", str(BASE_DIR / "veritaslink.db"))
STATIC_DIR = BASE_DIR / "app" / "static"
SIMULATIONS_DIR = BASE_DIR / "app" / "simulations"

# Security constraints
MAX_INVESTIGATION_STEPS = 25
INVESTIGATION_TIMEOUT_SECONDS = 120
ALLOWED_URL_SCHEMES = {"http", "https"}
FORBIDDEN_HOSTS = {
    "localhost", "127.0.0.1", "0.0.0.0", "::1",
    "169.254.169.254", "metadata.google.internal"
}

