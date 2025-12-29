# AI Code Assistant Tools

Quick reference for your semantic code search system.

## 🔧 Stack

- **Embeddings**: nomic-embed-text-v1.5 (768-dim, code-trained)
- **Vector DB**: Postgres + pgvector (local)
- **Indexing**: CocoIndex (incremental updates)
- **AI**: MiniMax M2.1 via Anthropic API

## 📊 Current Stats

- **Indexed chunks**: 202
- **Search quality**: ~63% average match
- **Cost per query**: ~$0.02
- **Speed**: 3-5 seconds

## 🚀 Common Commands

### Re-index codebase (after code changes)
```bash
python tools/index_codebase.py
```
- Scans `src/` for TS/TSX/JS/JSX files
- Chunks code intelligently (1000 chars, 200 overlap)
- Generates 768-dim embeddings
- Updates Postgres incrementally

### Search code semantically
```bash
python tools/search_code.py 'proximity tracking'
```
- Returns top 10 matches with similarity scores
- Shows filename, location, code preview
- No need for exact keywords

### Ask AI about your code
```bash
python tools/ai_editor_v3.py 'explain auth flow'
```
- Searches codebase semantically
- Sends relevant chunks to AI
- Gets grounded, zero-hallucination analysis
- No memory between queries (stateless)

## 🔄 When to Re-index

- ✅ After adding new features
- ✅ After major refactoring
- ✅ Once a week if actively developing
- ❌ Not needed for minor tweaks

## 🐛 Troubleshooting

### "Connection refused" error
```bash
# Check Postgres is running
pg_isready

# Start if needed
brew services start postgresql
# or: sudo systemctl start postgresql
```

### Search returns irrelevant results
```bash
# Re-index to pick up recent changes
python tools/index_codebase.py
```

### AI gives generic answers
- Check that re-indexing worked
- Try more specific queries
- Ensure .env has ANTHROPIC_API_KEY

## 📁 Files
```
tools/
├── index_codebase.py    # CocoIndex → Postgres indexing
├── search_code.py       # Semantic search only
└── ai_editor_v3.py      # AI analysis with search

Database:
└── Postgres (localhost:5432/codebase_index)
    └── Table: codebaseindex__codebase_embeddings
```

## 🎯 LanceDB Note

LanceDB was evaluated for trace/memory system but decided against it:
- Codebase itself is source of truth
- Git log captures what changed
- Don't have the pain point yet

May revisit if:
- Team grows (onboarding needs)
- Codebase hits 1000+ files
- Working on project after 6+ month gap

**For now: Keep it simple. The search works great.**

## 💡 Quick Tips

**Good queries:**
- "proximity tracking implementation"
- "how does auth timeout work"
- "dynamic island state management"

**Bad queries:**
- "code" (too vague)
- "fix bug" (need specifics)
- "all files" (use grep for that)

**After 6 months away:**
1. `python tools/index_codebase.py` (refresh index)
2. `python tools/ai_editor_v3.py 'overview of architecture'`
3. You're caught up in 30 seconds
