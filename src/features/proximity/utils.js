// src/features/proximity/utils.js

/**
 * Calculates the Euclidean distance between two points (user and profile) on the 2D map.
 * This is the Pythagorean theorem: distance = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 * @param {object} userCoords - Object with {left: string, top: string}
 * @param {object} profileCoords - Object with {left: string, top: string}
 * @returns {number} The distance in abstract units.
 */
export function calculateDistance(userCoords, profileCoords) {
  // Utility to parse 'XX%' strings into numbers (e.g., '50%' -> 50)
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
 * Creates and animates a floating heart element for visual feedback.
 */
export function createHeart(x, y) {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.innerHTML = "❤️";

  // Set initial position based on the center of the click/action element
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;

  // Apply a random horizontal drift for better visual effect
  const driftX = (Math.random() - 0.5) * 50; // Random number between -25 and 25
  heart.style.setProperty("--drift-x", `${driftX}px`);

  document.body.appendChild(heart);

  // Remove the element after the animation is finished
  setTimeout(() => {
    heart.remove();
  }, 3000);
}
