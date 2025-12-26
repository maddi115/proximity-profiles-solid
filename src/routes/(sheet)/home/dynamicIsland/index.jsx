import { Show, createEffect } from "solid-js";
import { islandStore, islandActions } from "./store/islandStore";
import { notificationStore } from "../../../../features/notifications/store/notificationStore";
import { proximityHitsStore } from "../../../../features/proximity/store/proximityHitsStore";
import { useProximityTracking } from "../../../../features/proximity/hooks/useProximityTracking";
import { CompactMode } from "./modes/CompactMode";
import { ProximityMode } from "./modes/ProximityMode";
import { NotificationMode } from "./modes/NotificationMode";
import { IslandModes } from "./types";
import styles from '../home.module.css';

export function DynamicIsland() {
  useProximityTracking();
  const nearbyCount = () => proximityHitsStore.currentHits.length;
  const queueCount = () => notificationStore.queue.length;

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
    <div class={styles.dynamicIsland}>
      <Show when={islandStore.currentMode === IslandModes.COMPACT}>
        <CompactMode
          nearbyCount={nearbyCount()}
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
