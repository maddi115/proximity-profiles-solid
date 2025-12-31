"""
Safe file reading patterns (regex).
These allow reading source files for planning and analysis.
"""

SAFE_FILE_PATTERNS = [
    # Source files
    r'^cat src/[a-zA-Z0-9/_\-\.]+\.(jsx?|tsx?|ts|css|scss|md|json)$',
    
    # Planning documents
    r'^cat planning/[a-zA-Z0-9/_\-\.]+\.md$',
    
    # Root markdown files
    r'^cat [a-zA-Z0-9_\-\.]+\.md$',
    
    # Configuration files
    r'^cat package\.json$',
    r'^cat tsconfig\.json$',
    r'^cat \.env\.example$',
    
    # === NEW: Safe analysis commands ===
    
    # Line counting (wc)
    r'^wc -l src/.*\.(jsx?|tsx?|ts|css|md)$',
    
    # File finding
    r'^find src/ -name ".*\.(jsx?|tsx?|ts|css|md)"$',
    r'^find src/ -type [df]$',
    
    # Code search (grep)
    r'^grep -r[n]? "[^;|&]*" src/$',
    r'^grep -r[n]? "[^;|&]*" src/features/$',
    
    # Directory sizes
    r'^du -sh? src/?.*$',
    
    # Enhanced listing
    r'^ls -la? src(/[a-zA-Z0-9/_\-]+)?$',
    r'^ls -la? planning/?$',
    
    # Tree with depth
    r'^tree src(/[a-zA-Z0-9/_\-]+)? -L [1-3]$',
    
    # Git history
    r'^git log --oneline( -\d+)?$',
    r'^git show --stat HEAD~?\d*$',
    r'^git branch -a$',
]
