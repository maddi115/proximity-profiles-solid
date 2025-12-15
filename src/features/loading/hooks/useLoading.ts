import { onCleanup } from "solid-js";
import { loadingActions } from "../store/loadingStore";

interface UseLoadingReturn {
  isLoading: (key: string) => boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * useLoading Hook (silent mode)
 */
export function useLoading(): UseLoadingReturn {
  const activeOperations = new Set<string>();

  onCleanup(() => {
    activeOperations.forEach(key => {
      loadingActions.stopLoading(key);
    });
    activeOperations.clear();
  });

  const startLoading = (key: string): void => {
    activeOperations.add(key);
    loadingActions.startLoading(key);
  };

  const stopLoading = (key: string): void => {
    activeOperations.delete(key);
    loadingActions.stopLoading(key);
  };

  const withLoading = async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  };

  const isLoading = (key: string): boolean => {
    return loadingActions.isLoading(key);
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}
