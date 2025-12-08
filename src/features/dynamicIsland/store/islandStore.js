import { createStore } from "solid-js/store";
import { IslandModes } from "../types";

/**
 * DynamicIsland Store - Simplified for smoother transitions
 */

const [store, setStore] = createStore({
  currentMode: IslandModes.COMPACT,
  isExpanded: false,
  previousMode: IslandModes.COMPACT
});

export const islandActions = {
  expand() {
    setStore({
      previousMode: store.currentMode,
      currentMode: IslandModes.PROXIMITY,
      isExpanded: true
    });
  },
  
  collapse() {
    setStore({
      previousMode: store.currentMode,
      currentMode: IslandModes.COMPACT,
      isExpanded: false
    });
  },
  
  showNotification() {
    // Only save previous mode if not already in notification
    if (store.currentMode !== IslandModes.NOTIFICATION) {
      setStore("previousMode", store.currentMode);
    }
    
    setStore({
      currentMode: IslandModes.NOTIFICATION,
      isExpanded: true
    });
  },
  
  returnFromNotification() {
    const shouldBeExpanded = store.previousMode !== IslandModes.COMPACT;
    
    setStore({
      currentMode: store.previousMode,
      isExpanded: shouldBeExpanded
    });
  }
};

export { store as islandStore };
