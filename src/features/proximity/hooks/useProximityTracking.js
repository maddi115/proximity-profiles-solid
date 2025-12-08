import { onMount, onCleanup } from "solid-js";
import { proximityHitsStore, proximityHitsActions } from "../store/proximityHitsStore";

/**
 * Hook to track proximity (would use BLE/GPS in real app)
 * For now, simulates with mock data
 */
export function useProximityTracking() {
  let interval;
  
  onMount(() => {
    // TODO: Real BLE/GPS tracking
    // For now, simulate with mock data
    simulateProximity();
  });
  
  onCleanup(() => {
    if (interval) clearInterval(interval);
  });
  
  function simulateProximity() {
    // Mock: Add some nearby people
    const mockProfiles = ['1', '2', '3'];
    
    mockProfiles.forEach((id, index) => {
      proximityHitsActions.updateProximity(
        id,
        20 + (index * 15) // 20ft, 35ft, 50ft
      );
    });
    
    // Simulate distance changes every 5 seconds
    interval = setInterval(() => {
      mockProfiles.forEach(id => {
        const distance = Math.floor(Math.random() * 80) + 20; // 20-100ft
        proximityHitsActions.updateProximity(id, distance);
      });
    }, 5000);
  }
  
  return {
    currentHits: () => proximityHitsStore.currentHits,
    history: () => proximityHitsStore.history
  };
}
