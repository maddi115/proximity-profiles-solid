#!/usr/bin/env python3
"""
AI Coding Agent v3 - Powered by CocoIndex + Postgres + MiniMax M2.1
"""
import anthropic
import psycopg2
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Initialize embedding model
model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)

# Initialize MiniMax M2.1
client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    base_url="https://api.minimax.io/anthropic"
)

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

def semantic_search_code(query: str, limit: int = 5) -> list[dict]:
    """Search codebase semantically using Postgres + pgvector"""
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Embed query
        query_embedding = model.encode(query).tolist()
        
        # Vector search
        cur.execute("""
            SELECT filename, code, location,
                   1 - (embedding <=> %s::vector) as similarity
            FROM codebaseindex__codebase_embeddings
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, limit))
        
        results = [
            {
                "filepath": row[0],
                "code": row[1],
                "location": row[2],
                "similarity": row[3]
            }
            for row in cur.fetchall()
        ]
        
        cur.close()
        conn.close()
        
        return results
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        print("   Run: python tools/index_codebase.py")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Search failed: {e}")
        return []

def build_smart_context(task: str) -> str:
    """Build context from relevant code"""
    
    print(f"🔍 Searching codebase for relevant code...\n")
    
    results = semantic_search_code(task, limit=5)
    
    if not results:
        return "⚠️  No relevant code found in index."
    
    print(f"   ✅ Found {len(results)} relevant sections\n")
    
    context = "RELEVANT CODE FROM YOUR CODEBASE:\n\n"
    
    for i, result in enumerate(results, 1):
        similarity = result["similarity"] * 100
        
        context += f"{i}. {result['filepath']} ({similarity:.1f}% match)\n"
        context += f"   Location: {result['location']}\n"
        context += f"```\n{result['code']}\n```\n\n"
    
    return context

def run_agent(task: str):
    """Run the AI agent"""
    
    print("=" * 70)
    print(f"🎯 TASK: {task}")
    print("=" * 70)
    print()
    
    # Get relevant code
    context = build_smart_context(task)
    
    # Build prompt
    prompt = f"""You are an expert coding assistant with access to the user's codebase.

TASK: {task}

{context}

Based on the RELEVANT CODE above, provide a detailed analysis or solution.
Reference the specific code you see. Be precise and actionable.
"""
    
    print("🤖 MiniMax M2.1 analyzing...\n")
    
    try:
        response = client.messages.create(
            model="MiniMax-M2.1",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        print("=" * 70)
        print("💡 ANALYSIS")
        print("=" * 70)
        print()
        
        # Handle both text and thinking blocks
        for block in response.content:
            if hasattr(block, 'text'):
                print(block.text)
            elif hasattr(block, 'thinking'):
                # Skip thinking blocks, just show final answer
                pass
        print()
        
    except Exception as e:
        print(f"❌ MiniMax API error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("AI Coding Agent v3 - Semantic Code Search")
        print()
        print("Usage:")
        print("  python tools/ai_editor_v3.py 'your task'")
        print()
        print("Examples:")
        print("  python tools/ai_editor_v3.py 'explain proximity features'")
        print("  python tools/ai_editor_v3.py 'find authentication logic'")
        sys.exit(1)
    
    run_agent(sys.argv[1])
