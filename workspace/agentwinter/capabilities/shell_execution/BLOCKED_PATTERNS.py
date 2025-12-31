"""
Security: Patterns that are ALWAYS blocked.
These prevent destructive or dangerous operations.

NOTE: Pipes (|), chains (&&, ;) are handled smartly in executor.py
      They're allowed for read-only operations, blocked for dangerous ones.
"""

BLOCKED_PATTERNS = [
    # File operations (destructive) - KEEP THESE
    r'\brm\b',              # Delete files
    r'\bmv\b',              # Move files
    r'\bcp\b',              # Copy files

    # Permission changes - KEEP THESE
    r'\bchmod\b',           # Change permissions
    r'\bchown\b',           # Change ownership

    # Privilege escalation - KEEP THESE
    r'\bsudo\b',            # Superuser
    r'\bsu\b',              # Switch user

    # Code evaluation - KEEP THESE
    r'\beval\b',            # Code evaluation
    r'\bexec\b',            # Code execution

    # Directory traversal - KEEP THESE
    r'\.\.\/',              # Parent directory
    r'/home(?!/maddi/proximity-profiles-solid)', # Outside project
    r'/etc',                # System files
    r'/usr',                # System files
    r'/root',               # Root directory

    # Large/sensitive directories - KEEP THESE
    r'\.git/objects',       # Git internals (read-only git commands OK)
    r'venv/',               # Virtual env
]
