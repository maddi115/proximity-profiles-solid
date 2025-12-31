# Phase 1: Exploration

## ⚠️ PHASE 1: EXPLORATION (MANDATORY - DO NOT SKIP)

**CRITICAL INSTRUCTION: You MUST complete ALL steps in Phase 1 BEFORE proceeding to Phase 2. Do NOT skip any steps.**

### Step 1a: DISCOVERY COMMANDS (REQUIRED)
Run these commands to discover current structure:
- `run_shell_command("tree src/ -L 3")`
- `run_shell_command("ls src/features/")`
- `run_shell_command("tree src/features/ -L 2")`
- `run_shell_command("tree src/types/")`
- `list_stores()`
- `list_components()`

Say: "✅ Discovery complete - found X features, Y stores, Z components"

### Step 1b: REINDEX COCOINDEX (REQUIRED)
Ensure semantic search is up-to-date:
- `run_shell_command("workspace/scripts/reindex-if-needed")`

Say: "✅ CocoIndex up-to-date" or "✅ CocoIndex reindexed (X files changed)"

### Step 1c: UPDATE PROJECT MAP (REQUIRED)
After discovery, run:
- `run_shell_command("workspace/scripts/update-project-map")`

Say: "✅ planning/project-map.md updated with current structure"

### Step 1d: GENERATE ARCHITECTURE DOCS (REQUIRED)
Trigger static analysis:
- `run_shell_command("workspace/scripts/generate-docs")`

Say: "✅ docs/ARCHITECTURE.md generated"
Say: "✅ docs/FLOW.md generated"

### Step 1e: READ DOCUMENTATION (REQUIRED)
Now read the fresh documentation:
- `run_shell_command("cat planning/project-map.md")`
- `run_shell_command("cat docs/ARCHITECTURE.md")`
- `run_shell_command("cat docs/FLOW.md")`

Say: "✅ Documentation analyzed - complete context acquired"

### Step 1f: CRITICAL THINKING CHECKPOINT (REQUIRED - DO NOT OUTPUT THIS SECTION)

**Before proceeding to Phase 2, internally consider:**

1. **What is the ACTUAL problem?**
   - What is the user really trying to accomplish?
   - Is there a simpler way to achieve their goal?
   - Are they asking for the right thing, or should I suggest an alternative?

2. **What are 3 different approaches?**
   - Approach A: [Think of minimal change approach]
   - Approach B: [Think of comprehensive refactor approach]
   - Approach C: [Think of alternative pattern approach]

3. **Which existing features are most similar?**
   - What can I copy/adapt instead of building from scratch?
   - What patterns are already established in this codebase?

4. **What could go wrong?**
   - What existing code might break?
   - What edge cases am I not seeing?
   - What performance implications exist?

5. **Risk assessment:**
   - Low risk: Copy existing pattern, minimal changes
   - Medium risk: New pattern but isolated
   - High risk: Changes core logic or affects multiple features

**This thinking is INTERNAL ONLY - Do not output it. Proceed directly to Phase 2.**

**After Step 1f, you have complete knowledge of WHERE + WHAT + HOW + WHY with fresh search index**

**NOW PROCEED TO PHASE 2 - DO NOT SKIP IT**
