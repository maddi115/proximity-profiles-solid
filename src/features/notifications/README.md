# Notifications Feature

**Independent notification system** - can be used anywhere in the app.

## Usage
```javascript
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

const { showNotification } = useNotifications();

// Show a notification
showNotification({
  type: 'success',
  message: 'Pulse sent! ❤️',
  icon: '❤️',
  duration: 3000
});
```

## Architecture

- **Store**: Queue management, current notification
- **Components**: Reusable notification UI
- **Hooks**: Easy access to notification system

## Independence

This feature does NOT depend on DynamicIsland or any other feature.
It can be used with toasts, modals, or any UI component.
