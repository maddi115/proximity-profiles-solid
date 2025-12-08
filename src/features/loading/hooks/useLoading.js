import { onCleanup } from "solid-js";
import { loadingStore, loadingActions } from "../store/loadingStore";

/**
 * useLoading Hook
 * Provides easy access to loading state management
 * 
 * Usage:
 * const { isLoading, startLoading, stopLoading, withLoading } = useLoading();
 * 
 * // Manual control
 * startLoading('my-operation');
 * // ... do work ...
 * stopLoading('my-operation');
 * 
 * // Automatic (recommended)
 * await withLoading('my-operation', async () => {
 *   await doSomething();
 * });
 */
export function useLoading() {
  const activeOperations = new Set();
  
  // Cleanup on unmount
  onCleanup(() => {
    activeOperations.forEach(key => {
      loadingActions.stopLoading(key);
    });
    activeOperations.clear();
  });
  
  const startLoading = (key) => {
    activeOperations.add(key);
    loadingActions.startLoading(key);
  };
  
  const stopLoading = (key) => {
    activeOperations.delete(key);
    loadingActions.stopLoading(key);
  };
  
  /**
   * Wrap async function with automatic loading state
   */
  const withLoading = async (key, asyncFn) => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  };
  
  const isLoading = (key) => {
    return loadingActions.isLoading(key);
  };
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}
