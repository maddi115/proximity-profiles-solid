import { ErrorCodes, ErrorMessages, AppError } from '../types';

/**
 * Central Error Handler
 * Handles errors consistently across the app
 * 
 * EXTENSIBLE: Easy to add logging, analytics, retry logic, etc.
 */

export const errorHandler = {
  /**
   * Handle an error
   * 
   * @param {Error|AppError|string} error - The error to handle
   * @param {Object} options - Handler options
   * @param {boolean} options.showNotification - Show error notification (default: true)
   * @param {Function} options.onError - Custom error callback
   * @param {string} options.context - Error context for logging
   */
  handle(error, options = {}) {
    const {
      showNotification = true,
      onError,
      context = 'unknown'
    } = options;
    
    // Normalize error
    const normalizedError = this._normalizeError(error);
    
    // Log error (can be extended with external logging service)
    this._logError(normalizedError, context);
    
    // Show notification if requested
    if (showNotification) {
      this._showErrorNotification(normalizedError);
    }
    
    // Call custom error handler
    if (onError) {
      onError(normalizedError);
    }
    
    return normalizedError;
  },
  
  /**
   * Normalize any error to AppError
   */
  _normalizeError(error) {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      // Check error message for known patterns
      const code = this._inferErrorCode(error.message);
      return new AppError(code, error.message);
    }
    
    if (typeof error === 'string') {
      const code = this._inferErrorCode(error);
      return new AppError(code, error);
    }
    
    return new AppError(ErrorCodes.UNKNOWN, 'An unexpected error occurred');
  },
  
  /**
   * Infer error code from message (extensible)
   */
  _inferErrorCode(message) {
    const msg = message?.toLowerCase() || '';
    
    if (msg.includes('balance') || msg.includes('insufficient')) {
      return ErrorCodes.INSUFFICIENT_BALANCE;
    }
    if (msg.includes('network') || msg.includes('connection')) {
      return ErrorCodes.NETWORK_ERROR;
    }
    if (msg.includes('timeout')) {
      return ErrorCodes.TIMEOUT;
    }
    if (msg.includes('unauthorized') || msg.includes('login')) {
      return ErrorCodes.UNAUTHORIZED;
    }
    if (msg.includes('rate limit') || msg.includes('too many')) {
      return ErrorCodes.RATE_LIMIT;
    }
    
    return ErrorCodes.UNKNOWN;
  },
  
  /**
   * Log error (extensible - can add Sentry, LogRocket, etc.)
   */
  _logError(error, context) {
    console.error(`[${context}]`, error.code, error.message, error.context);
    
    // TODO: Add external logging service here
    // Example: Sentry.captureException(error);
  },
  
  /**
   * Show error notification (uses existing notification system)
   */
  _showErrorNotification(error) {
    // Dynamic import to avoid circular dependency
    import('../../notifications/store/notificationStore').then(({ notificationActions }) => {
      notificationActions.showNotification({
        type: 'error',
        message: error.message,
        icon: '⚠️',
        duration: 4000
      });
    });
  }
};

/**
 * Convenience function for handling errors
 */
export function handleError(error, options) {
  return errorHandler.handle(error, options);
}
