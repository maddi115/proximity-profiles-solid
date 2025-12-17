import { Show, createEffect, onMount } from "solid-js";
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
 * DynamicIsland - Fully reactive (NO POLLING)
 */
export function DynamicIsland() {
  useProximityTracking();
  const nearbyCount = () => proximityHitsStore.currentHits.length;
  const queueCount = () => notificationStore.queue.length;

  // REACTIVE: Auto-responds to notifications
  createEffect(() => {
    const current = notificationStore.current;
    const isVisible = notificationStore.isVisible;
    if (current && isVisible) {
      islandActions.showNotification();
    } else if (!current && islandStore.currentMode === IslandModes.NOTIFICATION) {
      islandActions.returnFromNotification();
    }
  });

  return (
    <div class={styles.island}>
      <Show when={islandStore.currentMode === IslandModes.COMPACT}>
        <CompactMode
          nearbyCount={nearbyCount()}
          onExpand={() => islandActions.expand()}
        />
      </Show>
      <Show when={islandStore.currentMode === IslandModes.PROXIMITY}>
        <ProximityMode
          hits={proximityHitsStore.currentHits}
          onCollapse={() => islandActions.collapse()}
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
