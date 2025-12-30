# 🛠️ AgentWinter Scripts

Utility scripts for code formatting and maintenance.

## Formatting Tools

### format-all (Recommended)
Runs all formatters at once:
```bash
./workspace/scripts/format-all                    # Format workspace/agentwinter/
./workspace/scripts/format-all path/to/code/      # Format specific directory
```

### format-black
Python formatter (black):
```bash
./workspace/scripts/format-black workspace/agentwinter/
```

### format-autopep8
PEP8 compliant formatter:
```bash
./workspace/scripts/format-autopep8 workspace/agentwinter/
```

### format-ruff
Fast linter + formatter:
```bash
./workspace/scripts/format-ruff workspace/agentwinter/
```

## Quick Reference
```bash
# After copy-pasting Python code:
./workspace/scripts/format-all

# Before committing:
./workspace/scripts/format-all

# Check a specific file:
./workspace/scripts/format-black workspace/agentwinter/main.py
```

## AI Usage

AgentWinter can also call these scripts:
```
> format the code with black
> run all formatters
> fix python formatting
```
