#!/usr/bin/env python3
"""
AI Code Editor with Smart Memory (v4)
"""
import sys
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
import os
import anthropic
from edit_trace_lancedb import TraceManager

load_dotenv()

model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)
trace = TraceManager()

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    base_url=os.getenv("ANTHROPIC_BASE_URL")
)

def semantic_search_code(query, limit=5):
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
    return [{'filename': r[0], 'location': r[1], 'code': r[2], 'similarity': r[3]} for r in results]

def call_minimax(task, code_context, memory_context):
    prompt = f"""You are an expert code analyst.

{memory_context}

TASK: {task}

RELEVANT CODE:
{code_context}

Provide clear analysis. If building on previous changes, reference them naturally."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    
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
    
    print("🔍 Searching codebase...")
    code_results = semantic_search_code(task)
    print(f"   ✅ Found {len(code_results)} code sections")
    
    print("🧠 Loading memory...")
    memory = trace.get_memory_context(current_query=task, limit=5)
    if memory:
        print(f"   ✅ Found relevant past changes")
    print()
    
    code_context = ""
    files_involved = []
    for i, r in enumerate(code_results, 1):
        code_context += f"\n{i}. {r['filename']} ({r['similarity']*100:.1f}% match)\n"
        code_context += f"{r['code'][:800]}...\n"
        code_context += "-" * 70 + "\n"
        if r['filename'] not in files_involved:
            files_involved.append(r['filename'])
    
    print("🤖 Analyzing...")
    analysis = call_minimax(task, code_context, memory)
    
    print()
    print("=" * 70)
    print("💡 ANALYSIS")
    print("=" * 70)
    print()
    print(analysis)
    print()
    
    # Ask if change applied
    applied_input = input("\n📝 Did you apply a change? (y/n/suggest): ").lower()
    
    if applied_input == 'y':
        summary = input("💬 What changed (1-2 sentences): ")
        trace.add(query=task, summary=summary, files=files_involved, applied=True)
        print("✅ Applied change logged to memory")
    elif applied_input == 'suggest':
        summary = input("💬 What was suggested (1-2 sentences): ")
        trace.add(query=task, summary=summary, files=files_involved, applied=False)
        print("💡 Suggestion logged (won't show in memory)")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ai_editor_v4.py 'your query'")
        print()
        print("Memory:", trace.stats())
        sys.exit(1)
    
    run_agent(sys.argv[1])
