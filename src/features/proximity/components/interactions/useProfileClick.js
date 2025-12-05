import { RADIUS, DRAG_THRESHOLD } from "../../constants";

/**
 * Hook for handling profile click detection in the grid
 * Separates click from drag and detects which profile was clicked
 */
export function useProfileClick() {
  
  /**
   * Detect if a profile was clicked based on position
   * @param {MouseEvent} event - Click event
   * @param {import('../../types').Circle[]} visibleCircles - Circles to check
   * @param {import('../../types').Offset} offset - Current grid offset
   * @param {import('../../types').CullingBox} cullingBox - Culling box bounds
   * @param {import('../../types').Position} dragStart - Where drag started
   * @param {Function} getDistance - Function to calculate circle scale
   * @param {HTMLElement} overlayRef - Overlay element for bounds
   * @returns {import('../../types').Profile | null} Clicked profile or null
   */
  const detectClickedProfile = (
    event,
    visibleCircles,
    offset,
    cullingBox,
    dragStart,
    getDistance,
    overlayRef
  ) => {
    // Check if this was a drag, not a click
    const dragDist = Math.sqrt(
      Math.pow(event.clientX - dragStart.x, 2) + 
      Math.pow(event.clientY - dragStart.y, 2)
    );
    
    if (dragDist > DRAG_THRESHOLD) return null;
    
    // Convert click position to grid coordinates
    const rect = overlayRef.getBoundingClientRect();
    const clickX = event.clientX - rect.left + cullingBox.x;
    const clickY = event.clientY - rect.top + cullingBox.y;
    
    // Check each visible circle
    for (const circle of visibleCircles) {
      const scale = getDistance(circle);
      const screenX = circle.x + offset.x;
      const screenY = circle.y + offset.y;
      const dx = screenX - clickX;
      const dy = screenY - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Check if click is inside circle bounds
      if (dist < RADIUS * scale) {
        return circle.profile;
      }
    }
    
    return null;
  };
  
  return {
    detectClickedProfile
  };
}
