/**
 * Home Route (/)
 * 
 * PURPOSE:
 * The home page shows ProximityMap with the ProfileSheet at the bottom.
 * 
 * WHY IT'S EMPTY:
 * ProximityMap is already rendered in MainLayout, so we don't need to
 * render anything here. This route just lets ProximityMap show without
 * any overlay on top.
 * 
 * VISUAL RESULT:
 * - ProximityMap (Apple Watch grid)
 * - ProfileSheet (bottom sheet with selected profile)
 * - No menu page overlay
 */
export default function Home() {
  return null; // ProximityMap already visible from MainLayout
}
