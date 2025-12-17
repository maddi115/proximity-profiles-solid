import { Show } from "solid-js";
import styles from "./notifications.module.css";

/**
 * NotificationView - Displays a single notification with profile
 * Reusable in DynamicIsland, Toasts, or anywhere
 */
export function NotificationView(props) {
  const typeClass = () => {
    if (!props.notification) return '';
    switch(props.notification.type) {
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'info': return styles.info;
      case 'action': return styles.action;
      default: return '';
    }
  };

  return (
    <Show when={props.notification}>
      {(notification) => (
        <div class={`${styles.notification} ${typeClass()}`}>
          {notification().icon && (
            <span class={styles.icon}>{notification().icon}</span>
          )}
          <span class={styles.message}>{notification().message}</span>
          {notification().profile && (
            <img
              src={notification().profile.image}
              alt={notification().profile.name}
              class={styles.profilePic}
            />
          )}
          {notification().action && (
            <button
              class={styles.actionBtn}
              onClick={notification().action.handler}
            >
              {notification().action.label}
            </button>
          )}
        </div>
      )}
    </Show>
  );
}
