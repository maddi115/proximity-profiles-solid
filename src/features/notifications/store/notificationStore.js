import { createStore } from "solid-js/store";

/**
 * Notification Store
 * Manages notification queue and current display
 */

const [store, setStore] = createStore({
  queue: [],
  current: null,
  isVisible: false
});

let dismissTimeout = null;

export const notificationActions = {
  /**
   * Show a notification (adds to queue or displays immediately)
   */
  showNotification(notification) {
    const notif = {
      id: Date.now().toString(),
      duration: 3000,
      ...notification
    };
    
    if (store.current) {
      // Add to queue if something is showing
      setStore("queue", [...store.queue, notif]);
    } else {
      // Show immediately
      this._displayNotification(notif);
    }
  },
  
  /**
   * Internal: Display a notification
   */
  _displayNotification(notification) {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setStore("current", notification);
      setStore("isVisible", true);
    }, 50);
    
    // Auto-dismiss if duration > 0
    if (notification.duration > 0) {
      dismissTimeout = setTimeout(() => {
        this.dismissCurrent();
      }, notification.duration);
    }
  },
  
  /**
   * Dismiss current notification and show next in queue
   */
  dismissCurrent() {
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
      dismissTimeout = null;
    }
    
    setStore("isVisible", false);
    
    // Wait for fade out animation (450ms to match island transition)
    setTimeout(() => {
      setStore("current", null);
      
      // Wait a bit before showing next
      setTimeout(() => {
        if (store.queue.length > 0) {
          const next = store.queue[0];
          setStore("queue", store.queue.slice(1));
          this._displayNotification(next);
        }
      }, 100);
    }, 450);
  },
  
  /**
   * Clear entire queue
   */
  clearQueue() {
    setStore("queue", []);
  }
};

export { store as notificationStore };
