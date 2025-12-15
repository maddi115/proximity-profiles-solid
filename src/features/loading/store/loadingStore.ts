import { createStore } from "solid-js/store";
import { LoadingOperation, LoadingOperations } from "../../../types/loading";

interface LoadingStore {
  operations: LoadingOperations;
}

const [store, setStore] = createStore<LoadingStore>({
  operations: {}
});

export const loadingActions = {
  startLoading(key: string): void {
    setStore("operations", key, {
      isLoading: true,
      startTime: new Date()
    });
    console.log(`⏳ Loading started: ${key}`);
  },

  stopLoading(key: string): void {
    setStore("operations", key, undefined!);
    console.log(`✅ Loading stopped: ${key}`);
  },

  isLoading(key: string): boolean {
    return store.operations[key]?.isLoading || false;
  },

  getAllLoading(): string[] {
    return Object.keys(store.operations).filter(key =>
      store.operations[key]?.isLoading
    );
  },

  clearAll(): void {
    setStore("operations", {});
  }
};

export { store as loadingStore };
