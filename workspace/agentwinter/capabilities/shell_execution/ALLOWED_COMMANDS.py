"""
Explicitly whitelisted shell commands.
These specific commands are always allowed.
"""

ALLOWED_COMMANDS = [
    # Analysis tools
    "./analyze-project.sh",
    "analyze-project.sh",

    # Documentation (specific paths)
    "cat TOOLS.md",
    "cat workspace/README.md",
    "cat workspace/SAFETY-GUARDRAILS.md",
    "cat workspace/static-analysis/output/ARCHITECTURE.md",
    "cat workspace/static-analysis/output/FLOW.md",

    # Directory listing
    "ls",
    "ls workspace",
    "ls workspace/static-analysis/output",
    "tree src",
    "pwd",

    # Git operations (read-only)
    "git status",
    "git diff",
    
    # ═══════════════════════════════════════════════════════════
    # READ-ONLY COMMANDS (Safe - no file modification)
    # ═══════════════════════════════════════════════════════════
    
    # File viewing (read-only)
    "cat",      # Allow any cat command (BLOCKED_PATTERNS prevents dangerous use)
    "head",     # Read first lines of files
    "tail",     # Read last lines of files
    "less",     # Paginated file viewing
    "more",     # Paginated file viewing
    
    # File searching (read-only)
    "find",     # Find files/directories
    "grep",     # Search text in files
    "wc",       # Count lines/words/characters
    
    # Directory operations (read-only)
    "tree",     # Show directory structure
    "du",       # Disk usage (read-only)
    "df",       # Disk free space (read-only)
    
    # System info (read-only)
    "which",    # Locate commands
    "whereis",  # Locate binaries
    "file",     # Identify file types
    "stat",     # File statistics
    
    # ═══════════════════════════════════════════════════════════
    # YOUR PROJECT SCRIPTS (Safe - your own code)
    # ═══════════════════════════════════════════════════════════
    
    "workspace/scripts/reindex-if-needed",
    "workspace/scripts/generate-docs",
    "workspace/scripts/update-project-map",
    "workspace/scripts/fix-broken-python",
    "workspace/scripts/format-all",
    "workspace/scripts/format-autopep8",
    "workspace/scripts/format-black",
    "workspace/scripts/format-ruff",
]
