/**
 * Generates vertical honeycomb pattern positions
 * Pattern: 1, 3, 2, 3, 2, 3... (center, then alternating rows)
 */
export function generateHoneycombPositions(count, radius, padding) {
  const spacing = radius * 2 + padding;
  const verticalSpacing = spacing * 0.866;
  const positions = [];
  
  let row = 0;
  let placed = 0;
  
  while (placed < count) {
    let itemsInRow, offsetX;
    
    if (row === 0) {
      itemsInRow = 1;
      offsetX = 0;
    } else if (row % 2 === 1) {
      itemsInRow = 3;
      offsetX = 0;
    } else {
      itemsInRow = 2;
      offsetX = spacing / 2;
    }
    
    for (let col = 0; col < itemsInRow && placed < count; col++) {
      const x = (col - (itemsInRow - 1) / 2) * spacing;
      const y = row * verticalSpacing;
      
      positions.push({ x, y });
      placed++;
    }
    
    row++;
  }
  
  return positions;
}

export function getGridBounds(positions, radius) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  positions.forEach(pos => {
    minX = Math.min(minX, pos.x - radius);
    maxX = Math.max(maxX, pos.x + radius);
    minY = Math.min(minY, pos.y - radius);
    maxY = Math.max(maxY, pos.y + radius);
  });
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}
