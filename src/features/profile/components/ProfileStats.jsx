import { profileStore } from "../store/profileStore";
import styles from "./profile.module.css";

/**
 * ProfileStats - Display user statistics
 */
export function ProfileStats() {
  return (
    <div class={styles.statsGrid}>
      <div class={styles.statCard}>
        <div class={styles.statValue}>${profileStore.user.balance.toFixed(2)}</div>
        <div class={styles.statLabel}>Balance</div>
      </div>
      
      <div class={styles.statCard}>
        <div class={styles.statValue}>{profileStore.user.stats.pulsesSent}</div>
        <div class={styles.statLabel}>Pulses Sent</div>
      </div>
      
      <div class={styles.statCard}>
        <div class={styles.statValue}>{profileStore.user.stats.revealsReceived}</div>
        <div class={styles.statLabel}>Reveals</div>
      </div>
      
      <div class={styles.statCard}>
        <div class={styles.statValue}>{profileStore.user.stats.following}</div>
        <div class={styles.statLabel}>Following</div>
      </div>
    </div>
  );
}
