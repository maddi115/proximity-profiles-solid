# 🔐 Safety Guardrails

This workspace has security restrictions for shell command execution.

## 📋 Complete Documentation:
**See:** `agentwinter/capabilities/shell_execution/WHAT_I_CAN_AND_CANNOT_DO.md`

## 🎯 Quick Summary:

### ✅ ALLOWED:
- Read source files (`cat src/**/*.jsx`)
- Analyze code structure (`tree`, `ls`, `find`, `grep`)
- Count lines (`wc -l`)
- Directory sizes (`du -sh`)
- Git operations (`git status`, `git log`, `git diff`)
- Run analysis tools (`./analyze-project.sh`)

### ❌ BLOCKED:
- File operations (`rm`, `mv`, `cp`)
- Command chaining (`|`, `&&`, `;`)
- Directory traversal outside project
- Package installation (`npm`, `pip`)
- Arbitrary command execution

**Project Scope:** Locked to `~/proximity-profiles-solid`

**Last Updated:** Phase 3 - Enhanced analysis capabilities
