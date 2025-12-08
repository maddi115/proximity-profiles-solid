import { createStore } from "solid-js/store";

/**
 * Loading Store
 * Tracks loading state for multiple operations by unique key
 * 
 * Example keys:
 * - 'pulse-user-123'
 * - 'reveal-user-456'
 * - 'login-form'
 */

const [store, setStore] = createStore({
  operations: {} // { [key]: { isLoading: boolean, startTime: Date } }
});

export const loadingActions = {
  /**
   * Start loading for a specific operation
   */
  startLoading(key) {
    setStore("operations", key, {
      isLoading: true,
      startTime: new Date()
    });
    console.log(`⏳ Loading started: ${key}`);
  },
  
  /**
   * Stop loading for a specific operation
   */
  stopLoading(key) {
    setStore("operations", key, undefined);
    console.log(`✅ Loading stopped: ${key}`);
  },
  
  /**
   * Check if specific operation is loading
   */
  isLoading(key) {
    return store.operations[key]?.isLoading || false;
  },
  
  /**
   * Get all loading operations
   */
  getAllLoading() {
    return Object.keys(store.operations).filter(key => 
      store.operations[key]?.isLoading
    );
  },
  
  /**
   * Clear all loading states (useful for cleanup)
   */
  clearAll() {
    setStore("operations", {});
  }
};

export { store as loadingStore };
