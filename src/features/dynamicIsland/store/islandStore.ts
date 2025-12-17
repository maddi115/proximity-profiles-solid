import { createStore } from "solid-js/store";
import { IslandModes, IslandMode } from "../types";

interface IslandStore {
  currentMode: IslandMode;
  isExpanded: boolean;
  previousMode: IslandMode;
}

const [store, setStore] = createStore<IslandStore>({
  currentMode: IslandModes.COMPACT,
  isExpanded: false,
  previousMode: IslandModes.COMPACT
});

export const islandActions = {
  expand(): void {
    setStore({
      previousMode: store.currentMode,
      currentMode: IslandModes.PROXIMITY,
      isExpanded: true
    });
  },

  collapse(): void {
    setStore({
      previousMode: store.currentMode,
      currentMode: IslandModes.COMPACT,
      isExpanded: false
    });
  },

  showNotification(): void {
    if (store.currentMode !== IslandModes.NOTIFICATION) {
      setStore("previousMode", store.currentMode);
    }
    setStore({
      currentMode: IslandModes.NOTIFICATION,
      isExpanded: false  // Changed from true to false - keep compact!
    });
  },

  returnFromNotification(): void {
    const shouldBeExpanded = store.previousMode !== IslandModes.COMPACT;
    setStore({
      currentMode: store.previousMode,
      isExpanded: shouldBeExpanded
    });
  }
};

export { store as islandStore };
