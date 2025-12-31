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
]
