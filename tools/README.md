# AI Code Assistant v9

**Autonomous code analysis powered by Tree-sitter + Semantic Search**

## Features

🌳 **Tree-sitter Parsing** - Compiler-grade understanding of your codebase  
🔍 **Semantic Search** - Find code by meaning, not just keywords (via Nomic embeddings)  
🤖 **Automatic Tool Selection** - Claude decides which tools to use  
📊 **Live Indexing** - Parses 81+ files, tracks 201+ symbols  
🔄 **Git Awareness** - Shows uncommitted changes  
💬 **Multi-Tool Execution** - Handles complex, multi-part queries  

---

## Quick Start
```bash
# Activate (from project root)
python tools/ai_editor_v9.py

# Example queries
> where is authStore used?
> show me all stores
> how does proximity tracking work?
> what components use useAuth?
```

---

## How It Works

### Hybrid Architecture

**Tree-sitter (Structure)** → Precise imports, function calls, component hierarchy  
**CocoIndex (Meaning)** → Semantic search via Nomic embeddings + pgvector  
**Claude Sonnet 4** → Autonomous tool orchestration and analysis

### Available Tools

| Tool | Usage | Example |
|------|-------|---------|
| `find_usages` | Where is symbol X defined/used? | "where is authStore used?" |
| `list_stores` | Show all stores in codebase | "show me all stores" |
| `list_components` | Show all React/Solid components | "list components" |
| `semantic_search` | Find code by behavior/concept | "how does auth work?" |

**Claude automatically picks the right tool(s) for your query!**

---

## Installation

### Prerequisites
```bash
pip install tree-sitter tree-sitter-languages sentence-transformers psycopg2 anthropic python-dotenv
```

### Environment Variables

Create `.env` in project root:
```bash
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_BASE_URL=https://api.anthropic.com  # optional
COCOINDEX_DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## Commands

| Command | Description |
|---------|-------------|
| `!refresh-tree` | Re-parse codebase and rebuild symbol index |
| `reindex` | Reminder to run CocoIndex embedding refresh |
| `quit`, `exit`, `q` | Exit the assistant |

---

## Architecture Details

### Parsing Strategy

1. **Tree-sitter First** - Tries AST parsing for TS/TSX/JS/JSX
2. **Regex Fallback** - Uses pattern matching if Tree-sitter fails
3. **Symbol Indexing** - Builds graph of definitions and usages

### Context Building

**For structural queries** ("where is X?"):
- Uses Tree-sitter parsed import graph
- Returns exact file locations and usage counts

**For conceptual queries** ("how does X work?"):
- Uses semantic search (Nomic embeddings)
- Retrieves relevant code chunks by meaning
- May combine multiple tools for comprehensive answers

### Example: Complex Query Handling
```
Query: "how does proximity tracking work?"

Claude automatically:
1. semantic_search("proximity tracking")
2. semantic_search("distance calculation") 
3. find_usages("proximityHitsStore")
4. semantic_search("tracking intervals")
... (13 tool calls total!)

Result: Comprehensive analysis citing actual code
```

---

## Performance

- **Parsing**: ~81/93 files successfully parsed
- **Symbols**: 201+ indexed (functions, components, stores, imports)
- **Query Speed**: 1-5s for simple queries, 10-30s for complex multi-tool queries
- **Accuracy**: Tree-sitter eliminates semantic search hallucinations

---

## Comparison to Alternatives

| Tool | Tree-sitter | Semantic Search | Auto Tool Selection | Live FS Access |
|------|-------------|-----------------|---------------------|----------------|
| **This (v9)** | ✅ | ✅ | ✅ | ✅ |
| Cursor | ❌ | ✅ | ❌ | ✅ |
| Aider | ❌ | ❌ | ❌ | ✅ |
| GitHub Copilot | ❌ | ⚠️ | ❌ | ❌ |
| CntxtJS | ❌ | ❌ | ❌ | ❌ (static JSON) |
| FalkorDB Code Graph | ⚠️ | ❌ | ❌ | ❌ (graph DB) |

---

## Tips

**Be specific with symbols:**
- ✅ "where is authStore used?"
- ❌ "where is the store used?" (ambiguous)

**For conceptual questions, use natural language:**
- ✅ "how does authentication flow work?"
- ✅ "show me error handling patterns"

**Multi-part queries work:**
- ✅ "show me all stores, and also where is authStore used?"

**Claude will call multiple tools if needed!**

---

## Troubleshooting

### "Symbol not found in index"
- Run `!refresh-tree` to rebuild the index
- Check if file is in `src/` (only parses src directory)
- Verify file is `.ts`, `.tsx`, `.jsx`, or `.js`

### Parsing shows 0/X files
- Check Tree-sitter installation: `pip install tree-sitter-languages`
- Fallback regex parser should still work

### Slow responses
- Complex queries trigger multiple tool calls (expected)
- CocoIndex semantic search requires DB connection
- Consider limiting search results for faster queries

---

## Development

**Built with:**
- Python 3.12+
- Tree-sitter (parsing)
- Nomic embeddings (semantic search)
- PostgreSQL + pgvector (vector DB)
- Claude Sonnet 4 (orchestration)

**Architecture:**
- Stateless tool execution
- Fresh messages per query (no history pollution)
- Autonomous tool selection via Anthropic's tool use API

---

## License

MIT

---

## Credits

Built by maddi as a production-grade alternative to commercial code assistants.

**Key Innovation:** Combining Tree-sitter's precision with semantic search's flexibility, orchestrated by Claude's reasoning.
