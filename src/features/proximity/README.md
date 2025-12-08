# Proximity Feature

**Independent proximity tracking system** - detects nearby people and maintains history.

## Usage
```javascript
import { useProximityTracking } from '@/features/proximity/hooks/useProximityTracking';

const { currentHits, history } = useProximityTracking();
```

## Architecture

- **Store**: Current hits, historical encounters
- **Components**: Reusable proximity UI (lists, cards)
- **Hooks**: Tracking logic (BLE/GPS integration)

## Independence

This feature does NOT depend on DynamicIsland or notifications.
It can be used in maps, lists, or any UI component.
