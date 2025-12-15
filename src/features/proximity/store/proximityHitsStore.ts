import { createStore } from "solid-js/store";
import { ProximityHit, ProximityHistoryEntry } from "../../../types/proximity";

interface ProximityHitsStore {
  currentHits: ProximityHit[];
  history: ProximityHistoryEntry[];
}

const [store, setStore] = createStore<ProximityHitsStore>({
  currentHits: [],
  history: []
});

export const proximityHitsActions = {
  updateProximity(profileId: string, distance: number): void {
    const existingIndex = store.currentHits.findIndex(h => h.profileId === profileId);
    const hit: ProximityHit = {
      profileId,
      distance,
      timestamp: new Date()
    };

    if (existingIndex >= 0) {
      setStore("currentHits", existingIndex, hit);
    } else {
      setStore("currentHits", [...store.currentHits, hit]);
    }

    this.addToHistory(profileId, distance);
  },

  removeFromCurrent(profileId: string): void {
    setStore("currentHits", store.currentHits.filter(h => h.profileId !== profileId));
  },

  addToHistory(profileId: string, distance: number): void {
    const existingIndex = store.history.findIndex(h => h.profileId === profileId);
    const now = new Date();

    if (existingIndex >= 0) {
      setStore("history", existingIndex, {
        lastSeen: now,
        closestDistance: Math.min(store.history[existingIndex].closestDistance, distance),
        encounters: store.history[existingIndex].encounters + 1
      });
    } else {
      setStore("history", [...store.history, {
        profileId,
        firstSeen: now,
        lastSeen: now,
        closestDistance: distance,
        encounters: 1
      }]);
    }
  },

  clearHistory(): void {
    setStore("history", []);
  },

  clearCurrent(): void {
    setStore("currentHits", []);
  }
};

export { store as proximityHitsStore };
