"""Semantic search using embeddings"""
import psycopg2

def semantic_search(query, embedding_model, db_url, limit=5):
    """Search codebase semantically"""
    query_embedding = embedding_model.encode(query).tolist()
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("""
        SELECT filename, code,
               1 - (embedding <=> %s::vector) as similarity
        FROM codebaseindex__codebase_embeddings
        ORDER BY similarity DESC
        LIMIT %s
    """, (query_embedding, limit))
    results = cur.fetchall()
    conn.close()

    return {
        "query": query,
        "results": [
            {
                "filename": r[0].replace('src/', ''),
                "code": r[1][:400] + "..." if len(r[1]) > 400 else r[1],
                "similarity": f"{r[2]*100:.1f}%"
            }
            for r in results
        ]
    }
