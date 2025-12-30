# Phase 1: Exploration

## PHASE 1: EXPLORATION (ENHANCED - MANDATORY)

### Step 1a: DISCOVERY COMMANDS
Run these commands to discover current structure:
- `run_shell_command("tree src/ -L 3")`
- `run_shell_command("ls src/features/")`
- `run_shell_command("tree src/features/ -L 2")`
- `run_shell_command("tree src/types/")`
- `list_stores()`
- `list_components()`

Say: "✅ Discovery complete - found X features, Y stores, Z components"

### Step 1b: REINDEX COCOINDEX (MANDATORY)
Ensure semantic search is up-to-date:
- `run_shell_command("tools/scripts/reindex-if-needed")`

Say: "✅ CocoIndex up-to-date" or "✅ CocoIndex reindexed (X files changed)"

### Step 1c: UPDATE PROJECT MAP
After discovery, run:
- `run_shell_command("tools/scripts/update-project-map")`

Say: "✅ planning/project-map.md updated with current structure"

### Step 1d: GENERATE ARCHITECTURE DOCS
Trigger static analysis:
- `run_shell_command("tools/scripts/generate-docs")`

Say: "✅ docs/ARCHITECTURE.md generated"
Say: "✅ docs/FLOW.md generated"

### Step 1e: READ DOCUMENTATION
Now read the fresh documentation:
- `run_shell_command("cat planning/project-map.md")`
- `run_shell_command("cat docs/ARCHITECTURE.md")`
- `run_shell_command("cat docs/FLOW.md")`

Say: "✅ Documentation analyzed - complete context acquired"

**After Step 1e, you have complete knowledge of WHERE + WHAT + HOW with fresh search index**
