import { onMount, onCleanup, Accessor } from "solid-js";
import { proximityHitsStore, proximityHitsActions } from "../store/proximityHitsStore";
import { ProximityHit, ProximityHistoryEntry } from "../../../types/proximity";

interface UseProximityTrackingReturn {
  currentHits: Accessor<ProximityHit[]>;
  history: Accessor<ProximityHistoryEntry[]>;
}

/**
 * Proximity tracking with proper cleanup (NO LEAKS)
 */
export function useProximityTracking(): UseProximityTrackingReturn {
  let interval: ReturnType<typeof setInterval> | null = null;
  let isActive = true;

  onMount(() => {
    console.log('🎯 Proximity tracking started');
    simulateProximity();

    // Page Visibility API
    const handleVisibilityChange = (): void => {
      isActive = !document.hidden;
      console.log(`🔄 Proximity tracking ${isActive ? 'resumed' : 'paused'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // CRITICAL: Cleanup everything
    onCleanup(() => {
      console.log('🧹 Proximity tracking cleanup');
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  });

  function simulateProximity(): void {
    const mockProfiles = ['1', '2', '3'];

    // Initial positions
    mockProfiles.forEach((id, index) => {
      proximityHitsActions.updateProximity(
        id,
        20 + (index * 15)
      );
    });

    // Update only when page is visible
    interval = setInterval(() => {
      if (isActive) {
        mockProfiles.forEach(id => {
          const distance = Math.floor(Math.random() * 80) + 20;
          proximityHitsActions.updateProximity(id, distance);
        });
      }
    }, 5000);
  }

  return {
    currentHits: () => proximityHitsStore.currentHits,
    history: () => proximityHitsStore.history
  };
}
