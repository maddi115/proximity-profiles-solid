"""
Sessions Augment - Adds session persistence to agentwinter

Usage:
    In tools/agentwinter.py:
    
    # Enable sessions
    from agentwinter.augments.sessions import session_main as main
    
    # Disable sessions (use core)
    # from agentwinter.main import main
"""

from .session_main import main as session_main
from .session_manager import SessionManager, generate_session_id
from .session_config import get_redis_client
from .session_query import process_query

__all__ = [
    'session_main',
    'SessionManager',
    'generate_session_id',
    'get_redis_client',
    'process_query',
]
