import { ProximityMap } from '../features/proximity/ProximityMap';
import { DynamicIsland } from '../features/dynamicIsland/components/DynamicIsland';
import { BalanceWarning } from '../features/dynamicIsland/components/BalanceWarning';
import styles from './mainLayout.module.css';

/**
 * Main App Layout - Top-level wrapper
 * ProximityMap + DynamicIsland renders once and persists across all routes
 */
export default function MainLayout(props) {
  return (
    <div class={styles.mainLayout}>
      {/* PERSISTENT: ProximityMap renders once and stays visible */}
      <ProximityMap />
      
      {/* PERSISTENT: Dynamic Island floats above everything */}
      <div class={styles.islandContainer}>
        <DynamicIsland />
        <BalanceWarning />
      </div>
      
      {/* DYNAMIC: Route content renders here */}
      {props.children}
    </div>
  );
}
