import styles from "./sheetPages.module.css";

export function Dashboard() {
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>Dashboard</h2>
      
      <div class={styles.statsGrid}>
        <div class={styles.statCard}>
          <div class={styles.statValue}>$100.00</div>
          <div class={styles.statLabel}>Balance</div>
        </div>
        
        <div class={styles.statCard}>
          <div class={styles.statValue}>8</div>
          <div class={styles.statLabel}>Nearby</div>
        </div>
        
        <div class={styles.statCard}>
          <div class={styles.statValue}>0</div>
          <div class={styles.statLabel}>Following</div>
        </div>
        
        <div class={styles.statCard}>
          <div class={styles.statValue}>0</div>
          <div class={styles.statLabel}>Actions</div>
        </div>
      </div>
    </div>
  );
}
