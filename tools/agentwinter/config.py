"""Configuration and client setup"""

import os
from dotenv import load_dotenv
import anthropic
from sentence_transformers import SentenceTransformer

load_dotenv()

# ANSI colors
COLORS = {
    "YELLOW": "\033[93m",
    "GREEN": "\033[92m",
    "CYAN": "\033[96m",
    "BLUE": "\033[94m",
    "RED": "\033[91m",
    "RESET": "\033[0m",
    "BOLD": "\033[1m",
}


def get_anthropic_client():
    """Get configured Anthropic client"""
    return anthropic.Anthropic(
        api_key=os.getenv("ANTHROPIC_API_KEY"), base_url=os.getenv("ANTHROPIC_BASE_URL")
    )


def get_embedding_model():
    """Load sentence transformer model"""
    print(f"{COLORS['CYAN']}Loading embedding model...{COLORS['RESET']}")
    return SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)


def get_db_url():
    """Get database URL from env"""
    return os.getenv("COCOINDEX_DATABASE_URL")
