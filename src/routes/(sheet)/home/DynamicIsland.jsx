import { Show, createEffect } from "solid-js";
import { islandStore, islandActions } from "../../../features/dynamicIsland/store/islandStore";
import { notificationStore } from "../../../features/notifications/store/notificationStore";
import { proximityHitsStore } from "../../../features/proximity/store/proximityHitsStore";
import { useProximityTracking } from "../../../features/proximity/hooks/useProximityTracking";
import { CompactMode } from "../../../features/dynamicIsland/components/modes/CompactMode";
import { ProximityMode } from "../../../features/dynamicIsland/components/modes/ProximityMode";
import { NotificationMode } from "../../../features/dynamicIsland/components/modes/NotificationMode";
import { IslandModes } from "../../../features/dynamicIsland/types";
import styles from './home.module.css';

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
    <div class={`${styles.dynamicIsland} ${islandStore.isExpanded ? styles.islandExpanded : ''}`}>
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
