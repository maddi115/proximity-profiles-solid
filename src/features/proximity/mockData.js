/**
 * Keep all profiles INSIDE the radius circle (150px radius = 300px diameter)
 * Distributed in concentric rings like Apple Watch
 */
function generateCircleLayout(count) {
  const positions = [];
  const maxRadius = 40; // Maximum radius in % (stays inside 300px circle)
  
  // Center profile
  positions.push({ top: 50, left: 50 });
  
  if (count === 1) return positions;
  
  // Distribute remaining profiles in rings
  const remaining = count - 1;
  
  if (remaining <= 6) {
    // Single ring around center
    for (let i = 0; i < remaining; i++) {
      const angle = (2 * Math.PI * i) / remaining;
      const x = 50 + maxRadius * 0.6 * Math.cos(angle);
      const y = 50 + maxRadius * 0.6 * Math.sin(angle);
      positions.push({ top: y, left: x });
    }
  } else {
    // Two rings: inner and outer
    const innerCount = Math.min(6, Math.floor(remaining / 2));
    const outerCount = remaining - innerCount;
    
    // Inner ring
    for (let i = 0; i < innerCount; i++) {
      const angle = (2 * Math.PI * i) / innerCount;
      const x = 50 + maxRadius * 0.4 * Math.cos(angle);
      const y = 50 + maxRadius * 0.4 * Math.sin(angle);
      positions.push({ top: y, left: x });
    }
    
    // Outer ring
    for (let i = 0; i < outerCount; i++) {
      const angle = (2 * Math.PI * i) / outerCount;
      const x = 50 + maxRadius * 0.75 * Math.cos(angle);
      const y = 50 + maxRadius * 0.75 * Math.sin(angle);
      positions.push({ top: y, left: x });
    }
  }
  
  return positions;
}

const profileData = [
  { id: 1, img: "https://i.imgur.com/2D8gFpZ.png", balance: 0 },
  { id: 2, img: "https://i.imgur.com/zLafbHr.png", balance: 0 },
  { id: 3, img: "https://i.imgur.com/SJfFa5D.png", balance: 0 },
  { id: 4, img: "https://i.imgur.com/gYxZ2TV.jpeg", balance: 0 },
  { id: 5, img: "https://i.imgur.com/fSNOzKx.png", balance: 0 },
  { id: 6, img: "https://i.imgur.com/8YAtaDK.png", balance: 100 },
  { id: 7, img: "https://i.imgur.com/prIKM5x.png", balance: 0 },
  { id: 8, img: "https://i.imgur.com/NyAlxXl.png", balance: 0 },
];

const positions = generateCircleLayout(profileData.length);

export const profiles = profileData.map((profile, index) => ({
  ...profile,
  top: `${positions[index].top.toFixed(1)}%`,
  left: `${positions[index].left.toFixed(1)}%`
}));

export const userProfile = {
  img: "https://i.imgur.com/2D8gFpZ.png",
};

export const closestProfile = profiles[1];
