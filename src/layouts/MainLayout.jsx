import { ProximityMap } from "../features/proximity/ProximityMap";
import styles from "./mainLayout.module.css";

/**
 * MainLayout - Top-level layout wrapper
 * 
 * ARCHITECTURE:
 * This layout renders ProximityMap ONCE at the root level.
 * ProximityMap stays persistent and visible across ALL routes.
 * Only the content inside the routes changes, not ProximityMap itself.
 * 
 * VISUAL HIERARCHY:
 * - ProximityMap (background, always visible)
 *   └─ props.children (routes render here - Home, Dashboard, etc.)
 * 
 * This prevents ProximityMap from resetting when navigating between pages.
 */
export default function MainLayout(props) {
  return (
    <div class={styles.mainLayout}>
      {/* PERSISTENT: ProximityMap renders once and stays visible */}
      <ProximityMap />
      
      {/* DYNAMIC: Route content renders here (Home, Dashboard, Settings, etc.) */}
      {props.children}
    </div>
  );
}
