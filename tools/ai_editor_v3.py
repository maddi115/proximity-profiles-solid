#!/usr/bin/env python3
"""
AI Code Editor v3 - Semantic search + AI analysis
"""
import sys
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
import os
import anthropic

load_dotenv()

# ANSI color codes
YELLOW = '\033[93m'
CYAN = '\033[96m'
GREEN = '\033[92m'
RESET = '\033[0m'
BOLD = '\033[1m'

def show_banner():
    """Show helpful usage banner"""
    print(f"\n{YELLOW}{'='*70}{RESET}")
    print(f"{YELLOW}💡 AI CODE ASSISTANT{RESET}")
    print(f"{YELLOW}{'='*70}{RESET}")
    print(f"{CYAN}Usage:{RESET} python tools/ai_editor_v3.py {GREEN}'your question here'{RESET}")
    print(f"\n{CYAN}Examples:{RESET}")
    print(f"  • python tools/ai_editor_v3.py {GREEN}'explain proximity features'{RESET}")
    print(f"  • python tools/ai_editor_v3.py {GREEN}'how does auth work'{RESET}")
    print(f"  • python tools/ai_editor_v3.py {GREEN}'show me dynamic island code'{RESET}")
    print(f"\n{CYAN}Tips:{RESET}")
    print(f"  • Be specific in your queries")
    print(f"  • Re-index after code changes: {GREEN}python tools/index_codebase.py{RESET}")
    print(f"  • Search only: {GREEN}python tools/search_code.py 'query'{RESET}")
    print(f"{YELLOW}{'='*70}{RESET}\n")

# Initialize
model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    base_url=os.getenv("ANTHROPIC_BASE_URL")
)

def semantic_search_code(query, limit=5):
    """Search codebase semantically"""
    query_embedding = model.encode(query).tolist()
    
    conn = psycopg2.connect(os.getenv("COCOINDEX_DATABASE_URL"))
    cur = conn.cursor()
    
    cur.execute("""
        SELECT filename, location, code,
               1 - (embedding <=> %s::vector) as similarity
        FROM codebaseindex__codebase_embeddings
        ORDER BY similarity DESC
        LIMIT %s
    """, (query_embedding, limit))
    
    results = cur.fetchall()
    conn.close()
    
    return [{
        'filename': r[0],
        'location': r[1],
        'code': r[2],
        'similarity': r[3]
    } for r in results]

def call_ai(task, context):
    """Call AI with context"""
    prompt = f"""You are an expert code analyst.

TASK: {task}

RELEVANT CODE FROM CODEBASE:
{context}

Provide clear, accurate analysis based on the code shown above."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Handle thinking blocks
    text_content = []
    for block in message.content:
        if block.type == "text":
            text_content.append(block.text)
    
    return "\n".join(text_content)

def run_agent(task):
    print("=" * 70)
    print(f"🎯 TASK: {task}")
    print("=" * 70)
    print()
    
    print("🔍 Searching codebase for relevant code...")
    results = semantic_search_code(task)
    print(f"   ✅ Found {len(results)} relevant sections")
    print()
    
    # Build context
    context = ""
    for i, r in enumerate(results, 1):
        context += f"\n{i}. {r['filename']} ({r['similarity']*100:.1f}% match)\n"
        context += f"Location: {r['location']}\n"
        context += f"Code:\n{r['code']}\n"
        context += "-" * 70 + "\n"
    
    print("🤖 AI analyzing...")
    print()
    
    analysis = call_ai(task, context)
    
    print("=" * 70)
    print("💡 ANALYSIS")
    print("=" * 70)
    print()
    print(analysis)
    print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        show_banner()
        sys.exit(1)
    
    task = sys.argv[1]
    run_agent(task)
