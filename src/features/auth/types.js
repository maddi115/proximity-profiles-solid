/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {Object} user_metadata - Custom user data
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} Session
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - Refresh token
 * @property {User} user - User object
 */
