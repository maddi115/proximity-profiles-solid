#!/usr/bin/env python3
"""
Quick semantic search utility for your codebase.
Uses Postgres + pgvector for vector search.
"""
import psycopg2
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Load embedding model
model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)

def get_db_connection():
    """Connect to local Postgres"""
    conn = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        database=os.getenv("POSTGRES_DB", "codebase_index"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "")
    )
    register_vector(conn)
    return conn

def search(query: str, limit: int = 10):
    """Search codebase and display results"""
    
    print(f"🔍 Searching for: '{query}'...\n")
    
    try:
        # Connect to Postgres
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Embed query
        query_embedding = model.encode(query).tolist()
        
        # Search with pgvector (cosine distance)
        cur.execute("""
            SELECT filename, code, location,
                   1 - (embedding <=> %s::vector) as similarity
            FROM codebaseindex__codebase_embeddings
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, limit))
        
        results = cur.fetchall()
        
        if not results:
            print("No results found.")
            return
        
        print(f"Found {len(results)} results:\n")
        print("=" * 70)
        
        for i, (filename, code, location, similarity) in enumerate(results, 1):
            print(f"\n{i}. {filename} ({similarity*100:.1f}% match)")
            print(f"   Location: {location}")
            print(f"   Preview:")
            
            # Show first 200 chars
            preview = code[:200].replace('\n', '\n   ')
            print(f"   {preview}...")
            print("-" * 70)
        
        cur.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        print("   Make sure Postgres is running: sudo service postgresql status")
        print("   And you've run: python tools/index_codebase.py")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Search failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Semantic Code Search")
        print()
        print("Usage:")
        print("  python tools/search_code.py 'search query'")
        print()
        print("Examples:")
        print("  python tools/search_code.py 'proximity mapping'")
        print("  python tools/search_code.py 'authentication'")
        sys.exit(1)
    
    search(sys.argv[1])
