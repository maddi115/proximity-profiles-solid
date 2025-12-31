# Code Understanding Pipeline

**Purpose:** Parse, index, and semantically search the codebase

---

## Files

### `parser.py`
- **Purpose:** Tree-sitter based code parsing
- **Exports:**
  - `parse_all_files()` - Parse entire codebase
  - `parse_file()` - Parse individual file
  - Extracts: functions, classes, imports, stores, components
- **Tech:** Uses tree-sitter for TypeScript, JavaScript, Python, JSX

### `indexer.py`
- **Purpose:** CocoIndex database management
- **Exports:**
  - `build_index()` - Create/update semantic index
  - `search_index()` - Semantic search queries
- **Tech:** Embedding-based search using sentence-transformers

### `cache.py`
- **Purpose:** Performance optimization via caching
- **Exports:**
  - `cached_semantic_search()` - Cached search wrapper
  - `get_cache_stats()` - Cache performance metrics
  - `clear_all_caches()` - Cache management
- **Tech:** LRU cache with TTL

### `file_watcher.py`
- **Purpose:** Live filesystem monitoring
- **Exports:**
  - `FileWatcher` - Monitors src/ for changes
  - Triggers re-indexing on file modifications
- **Tech:** Watchdog library

### `auto_refresh.py`
- **Purpose:** Automatic index refresh logic
- **Exports:**
  - `auto_refresh()` - Check and update index/docs
  - Detects stale indexes and regenerates
- **Tech:** Git hash comparison

---

## Data Flow
```
Source Files (src/)
    ↓
parser.py - Extract AST nodes
    ↓
indexer.py - Generate embeddings
    ↓
CocoIndex DB - Store vectors
    ↓
cache.py - Cache frequent queries
    ↓
Semantic Search Results
```

---

## Performance

- **Caching:** LRU cache for search results
- **Incremental:** Only re-indexes changed files
- **Background:** File watcher runs asynchronously
- **Smart refresh:** Git hash based staleness detection
