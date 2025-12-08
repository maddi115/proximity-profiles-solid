# Errors Feature

**Minimal but extensible error handling** - ready to grow as needed.

## Current Features

- Error type definitions
- Basic error handler
- Automatic error notifications
- Error logging (console)

## Usage
```javascript
import { handleError, AppError, ErrorCodes } from '@/features/errors';

try {
  if (balance < cost) {
    throw new AppError(ErrorCodes.INSUFFICIENT_BALANCE);
  }
} catch (error) {
  handleError(error, {
    context: 'pulse-action',
    showNotification: true
  });
}
```

## Future Extensions

This architecture is ready for:
- [ ] ErrorBoundary component (React-style error boundaries)
- [ ] Retry logic for failed operations
- [ ] External logging (Sentry, LogRocket)
- [ ] Custom error pages
- [ ] Error analytics
- [ ] User error reporting

## Independence

Minimal dependencies:
- Uses notification system for user feedback
- Otherwise completely independent
