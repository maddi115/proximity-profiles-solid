import { Show, onMount, onCleanup, createSignal } from "solid-js";
import { islandStore, islandActions } from "../store/islandStore";
import { notificationStore } from "../../notifications/store/notificationStore";
import { proximityHitsStore } from "../../proximity/store/proximityHitsStore";
import { useProximityTracking } from "../../proximity/hooks/useProximityTracking";
import { CompactMode } from "./modes/CompactMode";
import { ProximityMode } from "./modes/ProximityMode";
import { NotificationMode } from "./modes/NotificationMode";
import { IslandModes } from "../types";
import styles from "./island.module.css";

/**
 * DynamicIsland - Orchestrates proximity and notifications
 */
export function DynamicIsland() {
  // Track proximity
  useProximityTracking();
  
  let lastNotificationId = null;
  let checkInterval;
  
  // Track total remaining (current + queued)
  const [totalRemaining, setTotalRemaining] = createSignal(0);
  
  onMount(() => {
    console.log('🏝️ DynamicIsland mounted!');
    
    // Poll notification state
    checkInterval = setInterval(() => {
      const current = notificationStore.current;
      const queueLength = notificationStore.queue.length;
      
      // Calculate total remaining (current + queue)
      const remaining = (current ? 1 : 0) + queueLength;
      setTotalRemaining(remaining);
      
      // New notification appeared
      if (current && current.id !== lastNotificationId) {
        lastNotificationId = current.id;
        console.log('📢 New notification:', current.message, '| Remaining:', remaining);
        islandActions.showNotification();
      }
      
      // Notification dismissed
      if (!current && lastNotificationId) {
        console.log('✅ Notification cleared | Remaining:', remaining);
        lastNotificationId = null;
        islandActions.returnFromNotification();
      }
    }, 50);
  });
  
  onCleanup(() => {
    if (checkInterval) clearInterval(checkInterval);
  });
  
  const nearbyCount = () => proximityHitsStore.currentHits.length;
  const queueCount = () => notificationStore.queue.length;
  
  return (
    <div class={`${styles.island} ${islandStore.isExpanded ? styles.expanded : ''}`}>
      <Show when={islandStore.currentMode === IslandModes.COMPACT}>
        <CompactMode 
          nearbyCount={nearbyCount()}
          onExpand={() => {
            console.log('📍 Expanding to proximity mode');
            islandActions.expand();
          }}
        />
      </Show>
      
      <Show when={islandStore.currentMode === IslandModes.PROXIMITY}>
        <ProximityMode 
          hits={proximityHitsStore.currentHits}
          onCollapse={() => {
            console.log('⬇️ Collapsing to compact');
            islandActions.collapse();
          }}
          onSelectProfile={(id) => console.log('Select profile:', id)}
          onShowHistory={() => console.log('Show history')}
        />
      </Show>
      
      <Show when={islandStore.currentMode === IslandModes.NOTIFICATION}>
        <NotificationMode 
          notification={notificationStore.current}
          queueCount={queueCount()}
        />
      </Show>
    </div>
  );
}
