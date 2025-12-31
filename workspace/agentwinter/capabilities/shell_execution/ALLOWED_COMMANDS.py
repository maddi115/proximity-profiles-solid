"""
Explicitly whitelisted shell commands.
These specific commands are always allowed.
"""

ALLOWED_COMMANDS = [
    # Analysis tools
    "./analyze-project.sh",
    "analyze-project.sh",
    
    # Documentation
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
]
