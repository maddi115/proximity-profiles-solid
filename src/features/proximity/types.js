/**
 * Type definitions using JSDoc for IDE autocomplete and documentation
 * No TypeScript needed - pure JavaScript with type hints
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - Unique profile identifier
 * @property {string} name - Profile display name
 * @property {string} img - Profile image URL
 * @property {number} [balance] - Profile balance in dollars
 * @property {boolean} [isFollowing] - Whether user is following this profile
 * @property {string} [lastReaction] - Last reaction sent to this profile
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * @typedef {Object} Circle
 * @property {number} x - X position in grid
 * @property {number} y - Y position in grid
 * @property {string} color - Circle background color (hex)
 * @property {Profile} profile - Associated profile data
 * @property {string} id - Profile ID reference
 */

/**
 * @typedef {Object} Bounds
 * @property {number} minX - Minimum X coordinate
 * @property {number} maxX - Maximum X coordinate
 * @property {number} minY - Minimum Y coordinate
 * @property {number} maxY - Maximum Y coordinate
 * @property {number} width - Total width
 * @property {number} height - Total height
 */

/**
 * @typedef {Object} CullingBox
 * @property {number} x - X position on screen
 * @property {number} y - Y position on screen
 * @property {number} width - Box width
 * @property {number} height - Box height
 */

/**
 * @typedef {Object} Offset
 * @property {number} x - X offset
 * @property {number} y - Y offset
 */

// Export empty object so this can be imported
export {};
