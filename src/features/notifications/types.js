/**
 * Notification type definitions
 */

/**
 * @typedef {'success' | 'error' | 'info' | 'action'} NotificationType
 * 
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier
 * @property {NotificationType} type - Notification type
 * @property {string} message - Display message
 * @property {string} [icon] - Optional emoji/icon
 * @property {number} [duration] - Auto-dismiss duration (ms), 0 = manual
 * @property {Object} [profile] - Profile data for display
 * @property {string} profile.name - Profile name
 * @property {string} profile.image - Profile image URL
 * @property {Object} [action] - Optional action button
 * @property {string} action.label - Button label
 * @property {Function} action.handler - Click handler
 */

export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  ACTION: 'action'
};

export const DefaultDurations = {
  SUCCESS: 3000,
  ERROR: 4000,
  INFO: 3000,
  ACTION: 0 // Manual dismiss for actions
};
