"""
Security: Patterns that are ALWAYS blocked.
These prevent destructive or dangerous operations.
"""

BLOCKED_PATTERNS = [
    # File operations (destructive)
    r'\brm\b',              # Delete files
    r'\bmv\b',              # Move files  
    r'\bcp\b',              # Copy files
    
    # Permission changes
    r'\bchmod\b',           # Change permissions
    r'\bchown\b',           # Change ownership
    
    # Shells and execution
    r'\bbash\b',            # Shell execution
    r'\bsh\b',              # Shell execution
    r'\beval\b',            # Code evaluation
    
    # Redirects and pipes (potential for chaining)
    r'>',                   # Output redirect
    r'>>',                  # Append redirect
    r'\|',                  # Pipe
    r'&&',                  # Command chaining
    r';',                   # Command separator
    
    # Directory traversal
    r'\.\.\/',              # Parent directory
    r'/home(?!/maddi/proximity-profiles-solid)', # Outside project
    r'/etc',                # System files
    r'/usr',                # System files
    
    # Large/sensitive directories
    r'node_modules',        # Too large
    r'\.git/objects',       # Git internals
    r'venv/',               # Virtual env
    r'__pycache__',         # Python cache
]
