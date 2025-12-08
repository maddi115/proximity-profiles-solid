import styles from "./sheetPages.module.css";

export function Settings() {
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>Settings</h2>
      
      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Privacy</h3>
        <div class={styles.settingRow}>
          <span>Show profile</span>
          <input type="checkbox" checked />
        </div>
        <div class={styles.settingRow}>
          <span>Allow messages</span>
          <input type="checkbox" checked />
        </div>
      </div>
      
      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Notifications</h3>
        <div class={styles.settingRow}>
          <span>Pulse alerts</span>
          <input type="checkbox" checked />
        </div>
        <div class={styles.settingRow}>
          <span>New followers</span>
          <input type="checkbox" checked />
        </div>
      </div>
      
      <button class={styles.dangerBtn}>Delete Account</button>
    </div>
  );
}
