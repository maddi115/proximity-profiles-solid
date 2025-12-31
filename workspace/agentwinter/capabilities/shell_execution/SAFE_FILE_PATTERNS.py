"""
Safe file reading patterns (regex).
These allow reading source files for planning and analysis.
"""

SAFE_FILE_PATTERNS = [
    # ═══════════════════════════════════════════════════════════
    # SOURCE CODE (src/ directory)
    # ═══════════════════════════════════════════════════════════
    
    r'^cat src/[a-zA-Z0-9/_\-\.]+\.(jsx?|tsx?|ts|css|scss|md|json)$',
    r'^head -?\d* src/[a-zA-Z0-9/_\-\.]+\.(jsx?|tsx?|ts|css|md)$',
    r'^tail -?\d* src/[a-zA-Z0-9/_\-\.]+\.(jsx?|tsx?|ts|css|md)$',

    # ═══════════════════════════════════════════════════════════
    # WORKSPACE DIRECTORY (your AI project)
    # ═══════════════════════════════════════════════════════════
    
    # Python files
    r'^cat workspace/[a-zA-Z0-9/_\-\.]+\.py$',
    r'^head -?\d* workspace/[a-zA-Z0-9/_\-\.]+\.py$',
    r'^tail -?\d* workspace/[a-zA-Z0-9/_\-\.]+\.py$',
    
    # Markdown/docs
    r'^cat workspace/[a-zA-Z0-9/_\-\.]+\.md$',
    r'^head -?\d* workspace/[a-zA-Z0-9/_\-\.]+\.md$',
    
    # Config files
    r'^cat workspace/[a-zA-Z0-9/_\-\.]+\.(json|txt|yaml|yml)$',

    # ═══════════════════════════════════════════════════════════
    # DOCS DIRECTORY
    # ═══════════════════════════════════════════════════════════
    
    r'^cat docs/[a-zA-Z0-9/_\-\.]+\.md$',
    r'^head -?\d* docs/[a-zA-Z0-9/_\-\.]+\.md$',
    r'^tail -?\d* docs/[a-zA-Z0-9/_\-\.]+\.md$',

    # ═══════════════════════════════════════════════════════════
    # AGENTWINTER DIRECTORY (AI internals)
    # ═══════════════════════════════════════════════════════════
    
    r'^cat agentwinter/[a-zA-Z0-9/_\-\.]+\.(py|md)$',
    r'^head -?\d* agentwinter/[a-zA-Z0-9/_\-\.]+\.py$',
    r'^grep [^;|&]+ agentwinter/[a-zA-Z0-9/_\-\.]+\.py$',

    # ═══════════════════════════════════════════════════════════
    # PLANNING DOCUMENTS
    # ═══════════════════════════════════════════════════════════
    
    r'^cat planning/[a-zA-Z0-9/_\-\.]+\.md$',
    r'^head -?\d* planning/[a-zA-Z0-9/_\-\.]+\.md$',

    # ═══════════════════════════════════════════════════════════
    # ROOT LEVEL FILES
    # ═══════════════════════════════════════════════════════════
    
    r'^cat [a-zA-Z0-9_\-\.]+\.md$',
    r'^cat package\.json$',
    r'^cat tsconfig\.json$',
    r'^cat \.env\.example$',
    r'^cat requirements\.txt$',

    # ═══════════════════════════════════════════════════════════
    # ANALYSIS COMMANDS (read-only operations)
    # ═══════════════════════════════════════════════════════════

    # Line counting (wc)
    r'^wc -l src/.*\.(jsx?|tsx?|ts|css|md)$',
    r'^wc -l workspace/.*\.py$',
    r'^wc -l [a-zA-Z0-9/_\-\.]+$',

    # File finding (safe patterns only, no command injection)
    r'^find \. -name "[a-zA-Z0-9_\-\.\*]+" -type [df]$',
    r'^find \. -name "[a-zA-Z0-9_\-\.\*]+"$',
    r'^find src/ -name "[a-zA-Z0-9_\-\.\*]+" -type [df]$',
    r'^find src/ -name "[a-zA-Z0-9_\-\.\*]+"$',
    r'^find workspace/ -name "[a-zA-Z0-9_\-\.\*]+" -type [df]$',
    r'^find workspace/ -name "[a-zA-Z0-9_\-\.\*]+"$',
    r'^find workspace/ -name "[a-zA-Z0-9_\-\.\*]+" (-o -name "[a-zA-Z0-9_\-\.\*]+")+$',

    # Code search (grep) - no pipes/chains in pattern
    r'^grep -[rni]+ "[^;|&]*" src/$',
    r'^grep -[rni]+ "[^;|&]*" src/[a-zA-Z0-9/_\-]+$',
    r'^grep -[rni]+ "[^;|&]*" workspace/$',
    r'^grep -E "[^;|&]*" [a-zA-Z0-9/_\-\.]+$',

    # Directory sizes
    r'^du -sh? src(/[a-zA-Z0-9/_\-]+)?$',
    r'^du -sh? workspace(/[a-zA-Z0-9/_\-]+)?$',
    r'^du -sh? docs/?$',

    # Enhanced listing
    r'^ls -la? src(/[a-zA-Z0-9/_\-]+)?$',
    r'^ls -la? workspace(/[a-zA-Z0-9/_\-]+)?$',
    r'^ls -la? docs/?$',
    r'^ls -la? planning/?$',
    r'^ls -la? agentwinter(/[a-zA-Z0-9/_\-]+)?$',

    # Tree with depth limits
    r'^tree src(/[a-zA-Z0-9/_\-]+)? -L [1-5]$',
    r'^tree workspace(/[a-zA-Z0-9/_\-]+)? -L [1-5]$',
    r'^tree docs/ -L [1-3]$',
    r'^tree agentwinter(/[a-zA-Z0-9/_\-]+)? -L [1-5]$',
    r'^tree \. -L [1-3]$',

    # Git history (read-only)
    r'^git log --oneline( -\d+)?$',
    r'^git log --oneline --graph( -\d+)?$',
    r'^git show --stat HEAD~?\d*$',
    r'^git branch -a$',
    r'^git diff HEAD~?\d*$',
    
    # Python/script execution (your scripts only)
    r'^python3? workspace/scripts/[a-zA-Z0-9_\-]+$',
    r'^bash workspace/scripts/[a-zA-Z0-9_\-]+$',
    r'^workspace/scripts/[a-zA-Z0-9_\-]+$',
]
