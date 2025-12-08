/**
 * Proximity tracking type definitions
 */

/**
 * @typedef {Object} ProximityHit
 * @property {string} profileId - Profile identifier
 * @property {number} distance - Distance in feet
 * @property {Date} timestamp - When detected
 * @property {string} [direction] - Compass direction (N, NE, E, etc.)
 */

/**
 * @typedef {Object} ProximityHistoryEntry
 * @property {string} profileId - Profile identifier
 * @property {Date} firstSeen - First encounter
 * @property {Date} lastSeen - Most recent encounter
 * @property {number} closestDistance - Closest they've been
 * @property {number} encounters - Total number of times nearby
 */

export const ProximityThresholds = {
  VERY_CLOSE: 20,  // feet
  CLOSE: 50,
  NEARBY: 100,
  FAR: 200
};
