"""Caching layer for performance optimization"""
import functools
from cachetools import TTLCache
import hashlib

# LRU cache for parse results (lasts entire session)
parse_cache = {}

# TTL cache for embeddings (5 minutes)
embedding_cache = TTLCache(maxsize=500, ttl=300)

# TTL cache for semantic search results (5 minutes)
search_cache = TTLCache(maxsize=200, ttl=300)

def cache_key(func_name, *args, **kwargs):
    """Generate cache key from function name and arguments"""
    key_parts = [func_name]
    key_parts.extend(str(arg) for arg in args)
    key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
    key_str = "|".join(key_parts)
    return hashlib.md5(key_str.encode()).hexdigest()

def cached_parse_file(filepath, parse_func):
    """Cache parse results for files"""
    if filepath in parse_cache:
        return parse_cache[filepath]
    
    result = parse_func(filepath)
    parse_cache[filepath] = result
    return result

def cached_semantic_search(query, limit, search_func):
    """Cache semantic search results"""
    cache_key_str = f"{query}|{limit}"
    
    if cache_key_str in search_cache:
        return search_cache[cache_key_str]
    
    result = search_func(query, limit)
    search_cache[cache_key_str] = result
    return result

def clear_parse_cache():
    """Clear parse cache (call on file changes)"""
    parse_cache.clear()

def clear_search_cache():
    """Clear search cache"""
    search_cache.clear()

def clear_all_caches():
    """Clear all caches"""
    parse_cache.clear()
    search_cache.clear()
    embedding_cache.clear()

def get_cache_stats():
    """Get cache statistics"""
    return {
        "parse_cache_size": len(parse_cache),
        "search_cache_size": len(search_cache),
        "embedding_cache_size": len(embedding_cache),
    }
