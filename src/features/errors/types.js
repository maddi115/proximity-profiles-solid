/**
 * Error Types & Codes
 * Add more error types here as needed
 */

export const ErrorCodes = {
  // User errors
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  
  // Auth errors (for future)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Rate limiting
  RATE_LIMIT: 'RATE_LIMIT',
  
  // Generic
  UNKNOWN: 'UNKNOWN'
};

export const ErrorMessages = {
  [ErrorCodes.INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [ErrorCodes.INVALID_INPUT]: 'Invalid input',
  [ErrorCodes.NETWORK_ERROR]: 'Network error. Please try again',
  [ErrorCodes.TIMEOUT]: 'Request timed out',
  [ErrorCodes.UNAUTHORIZED]: 'Please log in',
  [ErrorCodes.FORBIDDEN]: 'Access denied',
  [ErrorCodes.RATE_LIMIT]: 'Too many requests. Please wait',
  [ErrorCodes.UNKNOWN]: 'Something went wrong'
};

/**
 * Custom error class for app errors
 */
export class AppError extends Error {
  constructor(code, message, context = {}) {
    super(message || ErrorMessages[code] || ErrorMessages[ErrorCodes.UNKNOWN]);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}
