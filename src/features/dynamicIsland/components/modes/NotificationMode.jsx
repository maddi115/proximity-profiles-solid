import { NotificationView } from "../../../notifications/components/NotificationView";
import { Show } from "solid-js";
import styles from "../island.module.css";

/**
 * NotificationMode - Shows current notification with queue counter
 */
export function NotificationMode(props) {
  return (
    <div class={styles.notificationMode} key={props.notification?.id}>
      <NotificationView notification={props.notification} />
      
      {/* Queue counter badge */}
      <Show when={props.queueCount > 0}>
        <div class={styles.queueCounter}>
          {props.queueCount}
        </div>
      </Show>
    </div>
  );
}
