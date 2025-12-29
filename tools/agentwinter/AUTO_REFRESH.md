# Auto-Refresh System

Automatically keeps CocoIndex and static documentation fresh.

## How It Works

On AgentWinter startup:

1. **Tree-sitter** - Always refreshes (fast, <1s)
2. **CocoIndex** - Refreshes if `src/` files changed since last index
3. **Static Docs** - Refreshes if `src/` files changed since last generation

## Markers

- `.coco_last_index` - Timestamp of last CocoIndex update
- `tools/docs/.last_generated` - Timestamp of last static doc generation

## Manual Refresh
```python
# In AgentWinter
> !refresh-all      # Refresh everything
> !refresh-coco     # Refresh CocoIndex only
> !refresh-static   # Refresh static docs only
```

## Skip Auto-Refresh
```bash
# Start without auto-refresh (fast startup)
SKIP_REFRESH=1 agentwinter
```

## Performance

- No changes: <1s startup (instant)
- CocoIndex refresh: 30-60s
- Static docs refresh: 1-2s
- Both refresh: 30-60s
