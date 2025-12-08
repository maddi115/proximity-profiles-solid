import { notificationStore, notificationActions } from "../store/notificationStore";

/**
 * Hook to access notification system
 * Use anywhere in the app to trigger notifications
 */
export function useNotifications() {
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
