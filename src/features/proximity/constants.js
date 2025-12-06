/**
 * Global constants for proximity features
 */

// Visual constants
export const RADIUS = 35;
export const PADDING = 12;
export const SCALE_FACTOR = 220;

// Colors for profile circles
export const COLORS = [
  "#FF9AA2", 
  "#FFB7B2", 
  "#FFDAC1", 
  "#E2F0CB", 
  "#B5EAD7", 
  "#C7CEEA"
];

// Culling box dimensions - compact square viewport
export const CULLING_BOX = {
  width: 250,   // Reduced to 250px
  height: 250   // Kept at 250px (square viewport)
};

// Animation durations (ms)
export const DURATIONS = {
  snapback: 1200,
  heart: 2000
};

// Interaction thresholds
export const DRAG_THRESHOLD = 5;
