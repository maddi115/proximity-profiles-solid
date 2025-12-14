import styles from '../routes.module.css';

export default function Dashboard() {
  return (
    <div class={styles.pageContent}>
      <h1 class={styles.pageTitle}>Dashboard</h1>
      
      <div class={styles.statsGrid}>
        <div class={styles.statCard}>
          <div class={styles.statValue}>127</div>
          <div class={styles.statLabel}>Total Pulses</div>
        </div>
        <div class={styles.statCard}>
          <div class={styles.statValue}>23</div>
          <div class={styles.statLabel}>Reveals</div>
        </div>
        <div class={styles.statCard}>
          <div class={styles.statValue}>89</div>
          <div class={styles.statLabel}>Following</div>
        </div>
      </div>
    </div>
  );
}
