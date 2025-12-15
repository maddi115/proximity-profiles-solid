import { Accessor } from "solid-js";
import { notificationStore, notificationActions } from "../store/notificationStore";
import { Notification, NotificationInput } from "../../../types/notification";

interface UseNotificationsReturn {
  current: Accessor<Notification | null>;
  isVisible: Accessor<boolean>;
  queue: Accessor<Notification[]>;
  showNotification: (notification: NotificationInput) => void;
  dismissCurrent: () => void;
  clearQueue: () => void;
}

/**
 * Hook to access notification system
 * Use anywhere in the app to trigger notifications
 */
export function useNotifications(): UseNotificationsReturn {
  return {
    // State
    current: () => notificationStore.current,
    isVisible: () => notificationStore.isVisible,
    queue: () => notificationStore.queue,

    // Actions
    showNotification: notificationActions.showNotification.bind(notificationActions),
    dismissCurrent: notificationActions.dismissCurrent.bind(notificationActions),
    clearQueue: notificationActions.clearQueue.bind(notificationActions)
  };
}
