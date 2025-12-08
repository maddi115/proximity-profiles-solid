import { Menu } from "../features/menu/Menu";
import styles from "./sheetLayout.module.css";

/**
 * SheetLayout - Bottom sheet overlay for menu pages
 * 
 * USAGE:
 * Used for Dashboard, Settings, Profile, Activity routes.
 * Displays content in a sheet overlay at the bottom of the screen.
 * 
 * ARCHITECTURE:
 * - ProximityMap (in MainLayout) stays visible in background
 * - SheetLayout adds a sheet overlay on top
 * - Route content (Dashboard, Settings, etc.) renders inside the sheet
 * - Menu button in footer for navigation
 * 
 * VISUAL LAYERS:
 * Layer 1 (background): ProximityMap from MainLayout
 * Layer 2 (foreground): This sheet with route content
 */
export default function SheetLayout(props) {
  return (
    <div class={styles.sheetOverlay}>
      <div class={styles.sheetCard}>
        {/* Scrollable content area for route pages */}
        <div class={styles.sheetScrollContent}>
          {props.children}
        </div>
        
        {/* Fixed footer with menu navigation */}
        <div class={styles.sheetFooter}>
          <Menu />
        </div>
      </div>
    </div>
  );
}
