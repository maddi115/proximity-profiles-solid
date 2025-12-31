# LLM Capabilities (What the AI Can Do)

**Purpose:** Action functions that Minimax 2.1 can invoke during conversations

**Note:** Agentwinter uses **Minimax 2.1** (via Anthropic SDK) as the LLM backend.

---

## Available Capabilities

### Code Analysis
- **`semantic_search.py`** - Search code by meaning/intent
- **`find_usages.py`** - Find symbol definitions and usages
- **`list_stores.py`** - Discover Zustand/SolidJS stores
- **`list_components.py`** - Find React/Solid components
- **`dependency_graph.py`** - Generate visual dependency maps
- **`run_treesitter_query.py`** - Complex AST pattern matching

### Git Operations
- **`git_history.py`** - File history, blame, contributors, diffs
  - `git_log()` - Commit history
  - `git_blame()` - Line-by-line authorship
  - `git_recent_changes()` - Recent commits
  - `git_contributors()` - Code ownership
  - `git_diff()` - Compare versions

### File Operations
- **`shell_execution/`** - Safe shell command execution
  - See `shell_execution/WHAT_I_CAN_AND_CANNOT_DO.md` for full details
  - Security policies in `ALLOWED_COMMANDS.py`, `BLOCKED_PATTERNS.py`

### Code Formatting
- **`format_code.py`** - Auto-format Python code
  - Supports: black, ruff, autopep8

---

## Shell Execution Module

**Location:** `capabilities/shell_execution/`

### Current Capabilities ✅
- Read source files: `cat src/**/*.jsx`
- List directories: `ls`, `tree`
- Git operations: `git status`, `git diff`, `git log`
- Show current directory: `pwd`

### Needed Improvements 🚀

**High Value Additions:**
```bash
# Line counting
wc -l src/**/*.ts src/**/*.tsx src/**/*.jsx

# File finding
find src/ -name "*.ts" -o -name "*.tsx"

# Code search (grep)
grep -r "pattern" src/
grep -rn "createStore" src/features/

# Directory sizes
du -sh src/
du -sh src/features/*

# Enhanced listing
ls -la src/features/

# Git history
git log --oneline -10
git show --stat HEAD
git branch -a
```

**Why These Help:**
- `wc -l` - Code size metrics for planning
- `find` - Locate files by pattern
- `grep -r` - Search across codebase
- `du -sh` - Understand project size
- Enhanced git - Better context on changes

**Implementation Status:**
- ✅ Basic commands whitelisted
- ⏳ Pattern-based commands need SAFE_FILE_PATTERNS.py update
- 📋 See `shell_execution/WHAT_I_CAN_AND_CANNOT_DO.md` for current status

---

## Adding New Capabilities

1. Create new `.py` file in `capabilities/`
2. Implement function with clear docstring
3. Add to `__init__.py` TOOLS registry
4. Update this README

---

## Security

All capabilities respect:
- Read-only access (no file modifications)
- Project scope (locked to `~/proximity-profiles-solid`)
- Shell command restrictions (see `shell_execution/`)
- No destructive operations
