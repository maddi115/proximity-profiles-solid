import { Show } from "solid-js";
import styles from "../island.module.css";

/**
 * NotificationMode - Shows current notification with queue counter
 * Wrapped with strict sizing to prevent expansion
 */
export function NotificationMode(props) {
  return (
    <div
      class={styles.notificationMode}
      key={props.notification?.id}
      style={{
        "max-width": "100%"
      }}
    >
      <div style={{
        "display": "flex",
        "align-items": "center",
        "gap": "6px",
        "max-width": "240px",
        "overflow": "hidden"
      }}>
        <span style={{
          "font-size": "16px",
          "flex-shrink": "0"
        }}>
          {props.notification?.icon || ''}
        </span>
        <span style={{
          "font-size": "11px",
          "white-space": "nowrap",
          "overflow": "hidden",
          "text-overflow": "ellipsis",
          "color": "white",
          "flex": "1",
          "min-width": "0"
        }}>
          {props.notification?.message || ''}
        </span>
        {props.notification?.profile && (
          <img
            src={props.notification.profile.image}
            alt={props.notification.profile.name}
            style={{
              "width": "24px",
              "height": "24px",
              "border-radius": "50%",
              "object-fit": "cover",
              "border": "1px solid rgba(255, 255, 255, 0.3)",
              "flex-shrink": "0"
            }}
          />
        )}
      </div>
      {/* Queue counter badge */}
      <Show when={props.queueCount > 0}>
        <div class={styles.queueCounter}>
          {props.queueCount}
        </div>
      </Show>
    </div>
  );
}
