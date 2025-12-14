import { ProximityMap } from '../features/proximity/ProximityMap';
import styles from './mainLayout.module.css';

/**
 * Main App Layout - Top-level wrapper
 * ProximityMap renders once and persists across all routes
 */
export default function MainLayout(props) {
  return (
    <div class={styles.mainLayout}>
      {/* PERSISTENT: ProximityMap renders once and stays visible */}
      <ProximityMap />
      
      {/* DYNAMIC: Route content renders here */}
      {props.children}
    </div>
  );
}
