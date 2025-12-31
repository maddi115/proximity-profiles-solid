# 🔐 What Commands Can I Run?

This document explains what shell commands the LLM can execute.

---

## ✅ I CAN RUN (Whitelisted Commands)

### Analysis & Documentation
```bash
./analyze-project.sh                              # Generate architecture docs
cat workspace/README.md                           # Read workspace info
cat workspace/static-analysis/output/ARCHITECTURE.md  # Read generated docs
cat workspace/static-analysis/output/FLOW.md      # Read data flow docs
```

### Directory Listing
```bash
ls                          # List current directory
ls workspace                # List workspace
tree src                    # Show src/ structure
```

### Git Operations (Read-Only)
```bash
git status                  # Check repo status
git diff                    # See uncommitted changes
```

### Source Files (Pattern-Based)
```bash
cat src/features/auth/components/LoginForm.jsx   # Read any .jsx/.tsx file
cat src/types/index.ts                            # Read TypeScript files
cat planning/project-map.md                       # Read planning docs
cat README.md                                      # Read any root .md file
```

**Pattern Rules:**
- ✅ Any file in `src/` with extensions: `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.scss`, `.md`, `.json`
- ✅ Any file in `planning/` with extension: `.md`
- ✅ Configuration files: `package.json`, `tsconfig.json`, `.env.example`

---

## ❌ I CANNOT RUN (Blocked)

### File Operations
```bash
rm file.txt                 # ❌ Delete files
mv old.txt new.txt          # ❌ Move files
cp file.txt copy.txt        # ❌ Copy files
```

### Permission Changes
```bash
chmod +x script.sh          # ❌ Change permissions
chown user:group file       # ❌ Change ownership
```

### Dangerous Patterns
```bash
cat file.txt > output       # ❌ Output redirection
ls | grep pattern           # ❌ Pipes
command1 && command2        # ❌ Command chaining
command1; command2          # ❌ Command separator
```

### Directory Traversal
```bash
cat ../../etc/passwd        # ❌ Access outside project
cd /home/other              # ❌ Leave project directory
```

### Sensitive Directories
```bash
ls node_modules             # ❌ Too large
cat .git/objects/*          # ❌ Git internals
ls venv/                    # ❌ Virtual environment
```

---

## 📋 How It Works

1. **Blacklist Check** → Command scanned for dangerous patterns
2. **Whitelist Check** → Must match `ALLOWED_COMMANDS.py` OR `SAFE_FILE_PATTERNS.py`
3. **Execute** → Run command in project directory with 60s timeout

---

## 🔧 Modifying Permissions

To add new allowed commands:
1. Edit `ALLOWED_COMMANDS.py` (exact commands)
2. Edit `SAFE_FILE_PATTERNS.py` (regex patterns)
3. Test thoroughly
4. Never weaken `BLOCKED_PATTERNS.py` security rules

---

## 🎯 Examples

### ✅ Good Commands
```bash
cat src/features/auth/hooks/useAuth.ts           # Read source file
cat planning/architecture-plan.md                # Read planning doc
ls workspace/static-analysis                      # List directory
git status                                         # Check git
```

### ❌ Blocked Commands
```bash
rm src/old-file.js                                # Delete (blocked)
cat src/file.js | grep pattern                    # Pipe (blocked)
cat /etc/passwd                                    # Outside project (blocked)
ls node_modules                                    # Too large (blocked)
```

---

**For questions, see:** `executor.py`, `ALLOWED_COMMANDS.py`, `BLOCKED_PATTERNS.py`, `SAFE_FILE_PATTERNS.py`
