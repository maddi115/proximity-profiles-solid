"""Redis configuration for session management"""

import sys
import redis


def get_redis_client():
    """Get Redis client for session storage"""
    try:
        r = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)
        r.ping()  # Test connection
        return r
    except redis.ConnectionError:
        print("\033[91m❌ Redis not running\033[0m")
        print("\033[93mStart with: redis-server\033[0m")
        sys.exit(1)
