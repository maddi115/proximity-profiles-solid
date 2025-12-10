import { onCleanup } from "solid-js";
import { loadingStore, loadingActions } from "../store/loadingStore";

/**
 * useLoading Hook (silent mode)
 */
export function useLoading() {
  const activeOperations = new Set();
  
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
