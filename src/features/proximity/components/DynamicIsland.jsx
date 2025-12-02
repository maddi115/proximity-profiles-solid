import { userProfile, closestProfile } from "../data";
import styles from "./island.module.css"; // <-- NEW CSS MODULE IMPORT

export function DynamicIsland() {
  return (
    <div class={styles["dynamic-island"]}>
      <div class={styles["island-avatar"]}>
        <img src={userProfile.img} alt="You" />
      </div>

      <div class={styles["proximity-text"]}>really close to</div>

      <div class={styles["island-avatar"]}>
        <img src={closestProfile.img} alt="Nearby" />
        <div class={styles["live-indicator"]}>
          <span class={styles["live-icon"]}>👁️</span>
        </div>
      </div>
    </div>
  );
}
