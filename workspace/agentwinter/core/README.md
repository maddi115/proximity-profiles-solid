# Core System Internals

**Purpose:** Essential system components for agentwinter operation

---

## Files

### `config.py`
- **Purpose:** Configuration and LLM client initialization
- **Exports:** 
  - `get_anthropic_client()` - Anthropic SDK client (points to Minimax 2.1 API)
  - `get_embedding_model()` - Sentence transformer (nomic-embed-text-v1.5)
  - `get_db_url()` - CocoIndex database path
  - `COLORS` - Terminal color constants
- **Model:** Uses **Minimax 2.1** via Anthropic-compatible API endpoint
  - Base URL: `https://api.minimax.io/anthropic`
  - SDK: Anthropic Python SDK (interface compatibility)

### `context.py`
- **Purpose:** Context window management for LLM queries
- **Exports:**
  - `build_full_context()` - Assembles context from query results
  - Manages token limits and context truncation

### `query.py`
- **Purpose:** Query orchestration and tool execution
- **Exports:**
  - `process_query()` - Main query processing loop
  - Handles tool calls, streaming responses, thinking blocks
  - Integrates with all capabilities

### `main.py`
- **Purpose:** Application entry point
- **Exports:**
  - `main()` - CLI entry point
  - Initializes indexing, file watching, auto-refresh
  - Manages REPL loop

---

## Architecture Flow
```
User Query
    ↓
main() - Entry & initialization
    ↓
process_query() - Tool orchestration
    ↓
build_full_context() - Context assembly
    ↓
Minimax 2.1 API - LLM processing (via Anthropic SDK)
    ↓
Response to user
```

---

## LLM Configuration

**Model:** Minimax 2.1  
**Interface:** Anthropic SDK (for API compatibility)  
**Endpoint:** https://api.minimax.io/anthropic  
**Embeddings:** nomic-ai/nomic-embed-text-v1.5

---

## Dependencies

- **Imports from:** `indexing/`, `capabilities/`
- **Used by:** Entry point (`agentwinter.py`), augments (`sessions/`)
