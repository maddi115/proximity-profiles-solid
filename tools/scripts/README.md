# 🛠️ AgentWinter Scripts

Utility scripts for code formatting and maintenance.

## Formatting Tools

### format-all (Recommended)
Runs all formatters at once:
```bash
./tools/scripts/format-all                    # Format tools/agentwinter/
./tools/scripts/format-all path/to/code/      # Format specific directory
```

### format-black
Python formatter (black):
```bash
./tools/scripts/format-black tools/agentwinter/
```

### format-autopep8
PEP8 compliant formatter:
```bash
./tools/scripts/format-autopep8 tools/agentwinter/
```

### format-ruff
Fast linter + formatter:
```bash
./tools/scripts/format-ruff tools/agentwinter/
```

## Quick Reference
```bash
# After copy-pasting Python code:
./tools/scripts/format-all

# Before committing:
./tools/scripts/format-all

# Check a specific file:
./tools/scripts/format-black tools/agentwinter/main.py
```

## AI Usage

AgentWinter can also call these scripts:
```
> format the code with black
> run all formatters
> fix python formatting
```
