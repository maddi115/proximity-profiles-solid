import styles from "./layouts.module.css";

/**
 * Main layout with ProximityMap background and content overlay
 */
export default function DashboardLayout(props) {
  return (
    <div class={styles.dashboardLayout}>
      {/* Content rendered by routes */}
      {props.children}
    </div>
  );
}
