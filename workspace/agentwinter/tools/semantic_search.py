"""Semantic search using embeddings"""

import psycopg2
from ..cache import cached_semantic_search


def semantic_search(query, embedding_model, db_url, limit=5):
    """Semantic search with caching and visual indicator"""
    from ..cache import search_cache
    from ..config import COLORS

    cache_key_str = f"{query}|{limit}"

    if cache_key_str in search_cache:
        print(f"    {COLORS['GREEN']}💨 CACHE HIT{COLORS['RESET']}")
        return search_cache[cache_key_str]

    # Not in cache, do actual search
    return cached_semantic_search(
        query,
        limit,
        lambda q, l: semantic_search_uncached(q, embedding_model, db_url, l),
    )


def semantic_search_uncached(query, embedding_model, db_url, limit=5):
    """Search codebase semantically"""
    query_embedding = embedding_model.encode(query).tolist()
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT filename, code,
               1 - (embedding <=> %s::vector) as similarity
        FROM codebaseindex__codebase_embeddings
        ORDER BY similarity DESC
        LIMIT %s
    """,
        (query_embedding, limit),
    )
    results = cur.fetchall()
    conn.close()

    return {
        "query": query,
        "results": [
            {
                "filename": r[0].replace("src/", ""),
                "code": r[1][:400] + "..." if len(r[1]) > 400 else r[1],
                "similarity": f"{r[2] * 100:.1f}%",
            }
            for r in results
        ],
    }
