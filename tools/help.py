#!/usr/bin/env python3
"""Quick help for AI tools"""

HELP = """
╔════════════════════════════════════════════════════════════════════╗
║                   AI CODE ASSISTANT - QUICK HELP                   ║
╚════════════════════════════════════════════════════════════════════╝

📚 COMMON COMMANDS:

  # Re-index codebase
  python tools/index_codebase.py

  # Search semantically
  python tools/search_code.py 'query here'

  # Ask AI about code
  python tools/ai_editor_v3.py 'explain feature X'

📊 CURRENT SETUP:

  Model:     nomic-embed-text-v1.5 (768-dim)
  Database:  Postgres + pgvector (local)
  Chunks:    ~202 indexed
  Quality:   ~63% avg match

🔧 DATABASE:

  Host:      localhost:5432
  Database:  codebase_index
  Table:     codebaseindex__codebase_embeddings

💡 TIPS:

  - Re-index after major code changes
  - Use specific queries ("auth flow" not "code")
  - Search is stateless (no memory between queries)

📖 Full docs: tools/README.md
"""

if __name__ == "__main__":
    print(HELP)
