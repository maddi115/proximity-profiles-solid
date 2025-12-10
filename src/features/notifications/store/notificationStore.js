import { createStore } from "solid-js/store";

/**
 * Notification Store with proper cleanup (NO LEAKS)
 */

const MAX_QUEUE_SIZE = 5;

const [store, setStore] = createStore({
  queue: [],
  current: null,
  isVisible: false
});

let dismissTimeout = null;

// Cleanup helper
function clearDismissTimeout() {
  if (dismissTimeout) {
    clearTimeout(dismissTimeout);
    dismissTimeout = null;
  }
}

export const notificationActions = {
  showNotification(notification) {
    const notif = {
      id: Date.now().toString(),
      duration: 3000,
      ...notification
    };
    
    if (store.current) {
      const newQueue = [...store.queue, notif];
      if (newQueue.length > MAX_QUEUE_SIZE) {
        console.warn('⚠️ Queue full, dropping oldest');
        newQueue.shift();
      }
      setStore("queue", newQueue);
    } else {
      this._displayNotification(notif);
    }
  },
  
  _displayNotification(notification) {
    // Clear any existing timeout first
    clearDismissTimeout();
    
    setTimeout(() => {
      setStore("current", notification);
      setStore("isVisible", true);
    }, 50);
    
    if (notification.duration > 0) {
      dismissTimeout = setTimeout(() => {
        this.dismissCurrent();
      }, notification.duration);
    }
  },
  
  dismissCurrent() {
    clearDismissTimeout();
    
    setStore("isVisible", false);
    
    setTimeout(() => {
      setStore("current", null);
      
      if (store.queue.length > 0) {
        const next = store.queue[0];
        setStore("queue", store.queue.slice(1));
        setTimeout(() => this._displayNotification(next), 100);
      }
    }, 450);
  },
  
  clearQueue() {
    clearDismissTimeout();
    setStore("queue", []);
  },
  
  // Cleanup method (call on app unmount if needed)
  cleanup() {
    clearDismissTimeout();
    this.clearQueue();
  }
};

export { store as notificationStore };
