# DynamicIsland Feature

**Orchestrator** - Manages modes and coordinates with notifications + proximity.

## Architecture

DynamicIsland does NOT own notifications or proximity.
It subscribes to their stores and switches modes based on their state.

## Modes

1. **Compact**: Small pill, shows nearby count
2. **Proximity**: Expanded, shows list of nearby people
3. **Notification**: Temporary, shows notification (then returns)

## Dependencies

- Depends on: `notifications/`, `proximity/`
- They do NOT depend on it (one-way dependency)
