import { createStore } from "solid-js/store";
import { Notification, NotificationInput } from "../../../types/notification";

interface NotificationStore {
  queue: Notification[];
  current: Notification | null;
  isVisible: boolean;
}

const MAX_QUEUE_SIZE = 5;

const [store, setStore] = createStore<NotificationStore>({
  queue: [],
  current: null,
  isVisible: false
});

let dismissTimeout: ReturnType<typeof setTimeout> | null = null;

function clearDismissTimeout(): void {
  if (dismissTimeout) {
    clearTimeout(dismissTimeout);
    dismissTimeout = null;
  }
}

export const notificationActions = {
  showNotification(notification: NotificationInput): void {
    const notif: Notification = {
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

  _displayNotification(notification: Notification): void {
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

  dismissCurrent(): void {
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

  clearQueue(): void {
    clearDismissTimeout();
    setStore("queue", []);
  },

  cleanup(): void {
    clearDismissTimeout();
    this.clearQueue();
  }
};

export { store as notificationStore };
