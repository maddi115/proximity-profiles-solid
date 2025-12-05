import { animate } from "motion";
import { DURATIONS } from "./constants";

/**
 * Calculate Euclidean distance between two coordinate points
 * @param {Object} userCoords - User coordinates with left/top as percentages
 * @param {Object} profileCoords - Profile coordinates with left/top as percentages
 * @returns {number} Distance between points
 */
export function calculateDistance(userCoords, profileCoords) {
  const parseCoord = (coord) => parseFloat(coord.replace("%", ""));
  const userX = parseCoord(userCoords.left);
  const userY = parseCoord(userCoords.top);
  const profileX = parseCoord(profileCoords.left);
  const profileY = parseCoord(profileCoords.top);
  const dx = profileX - userX;
  const dy = profileY - userY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create and animate a heart emoji at specified coordinates
 * Uses hardware-accelerated CSS transforms for 60fps animation
 * @param {number} x - X coordinate in pixels
 * @param {number} y - Y coordinate in pixels
 */
export function createHeart(x, y) {
  const heart = document.createElement("div");
  heart.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 40px;
    pointer-events: none;
    z-index: 10002;
    will-change: transform, opacity;
    backface-visibility: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
  `;
  heart.innerHTML = "❤️";
  const driftX = (Math.random() - 0.5) * 50;
  
  document.body.appendChild(heart);
  
  animate(
    heart,
    {
      opacity: [1, 0.8, 0],
      transform: [
        "translate3d(0, 0, 0) scale(1)",
        `translate3d(${driftX * 0.5}px, -60px, 0) scale(0.8)`,
        `translate3d(${driftX}px, -120px, 0) scale(0.3)`
      ]
    },
    {
      duration: DURATIONS.heart / 1000,
      easing: [0.25, 0.1, 0.25, 1.0]
    }
  ).finished.then(() => {
    heart.remove();
  });
}
