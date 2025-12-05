import { createMemo } from "solid-js";

export function useCulling(circles, offset, cullingBox, radius, scaleFactor) {
  
  const getDistance = (circle) => {
    const box = cullingBox();
    const off = offset();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const dx = circle.x + off.x - centerX;
    const dy = circle.y + off.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let scale = 1 - dist / scaleFactor;
    return scale > 0.3 ? scale : 0.3;
  };
  
  const isInCullingBox = (circle) => {
    const box = cullingBox();
    const off = offset();
    const scale = getDistance(circle);
    const scaledRadius = radius * scale;
    
    const screenX = circle.x + off.x;
    const screenY = circle.y + off.y;
    
    return (
      screenX - scaledRadius >= box.x &&
      screenX + scaledRadius <= box.x + box.width &&
      screenY - scaledRadius >= box.y &&
      screenY + scaledRadius <= box.y + box.height
    );
  };
  
  const visibleCircles = createMemo(() => {
    return circles().filter(isInCullingBox);
  });
  
  const centeredProfile = createMemo(() => {
    const box = cullingBox();
    const off = offset();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    const visible = visibleCircles();
    if (visible.length === 0) return null;
    
    let closest = visible[0];
    let minDist = Infinity;
    
    visible.forEach(circle => {
      const screenX = circle.x + off.x;
      const screenY = circle.y + off.y;
      const dx = screenX - centerX;
      const dy = screenY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < minDist) {
        minDist = dist;
        closest = circle;
      }
    });
    
    return closest;
  });
  
  const sortedVisibleCircles = createMemo(() => {
    return [...visibleCircles()].sort((a, b) => {
      return getDistance(a) - getDistance(b);
    });
  });
  
  return {
    getDistance,
    isInCullingBox,
    visibleCircles,
    centeredProfile,
    sortedVisibleCircles
  };
}
