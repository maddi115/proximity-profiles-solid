import { createStore } from "solid-js/store";

/**
 * Proximity Hits Store
 * Tracks current nearby people and historical encounters
 */

const [store, setStore] = createStore({
  currentHits: [],  // People nearby RIGHT NOW
  history: []       // Historical encounters
});

export const proximityHitsActions = {
  /**
   * Update proximity for a profile
   */
  updateProximity(profileId, distance) {
    const existingIndex = store.currentHits.findIndex(h => h.profileId === profileId);
    
    const hit = {
      profileId,
      distance,
      timestamp: new Date()
    };
    
    if (existingIndex >= 0) {
      // Update existing
      setStore("currentHits", existingIndex, hit);
    } else {
      // Add new
      setStore("currentHits", [...store.currentHits, hit]);
    }
    
    // Update history
    this.addToHistory(profileId, distance);
  },
  
  /**
   * Remove profile from current hits (they left range)
   */
  removeFromCurrent(profileId) {
    setStore("currentHits", store.currentHits.filter(h => h.profileId !== profileId));
  },
  
  /**
   * Add or update history entry
   */
  addToHistory(profileId, distance) {
    const existingIndex = store.history.findIndex(h => h.profileId === profileId);
    const now = new Date();
    
    if (existingIndex >= 0) {
      // Update existing
      setStore("history", existingIndex, {
        lastSeen: now,
        closestDistance: Math.min(store.history[existingIndex].closestDistance, distance),
        encounters: store.history[existingIndex].encounters + 1
      });
    } else {
      // Add new
      setStore("history", [...store.history, {
        profileId,
        firstSeen: now,
        lastSeen: now,
        closestDistance: distance,
        encounters: 1
      }]);
    }
  },
  
  /**
   * Clear all history
   */
  clearHistory() {
    setStore("history", []);
  },
  
  /**
   * Clear current hits (for testing)
   */
  clearCurrent() {
    setStore("currentHits", []);
  }
};

export { store as proximityHitsStore };
