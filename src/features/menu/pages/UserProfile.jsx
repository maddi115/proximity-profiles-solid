import styles from "./sheetPages.module.css";

export function UserProfile() {
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>My Profile</h2>
      
      <div class={styles.profileSection}>
        <div class={styles.avatarCircle}>You</div>
        <div>
          <h3 class={styles.profileName}>Your Name</h3>
          <p class={styles.profileBio}>Add a bio...</p>
        </div>
      </div>
      
      <div class={styles.infoRow}>
        <span>Balance</span>
        <span class={styles.balanceText}>$100.00</span>
      </div>
      
      <div class={styles.infoRow}>
        <span>Visibility</span>
        <span class={styles.statusText}>Visible</span>
      </div>
      
      <button class={styles.actionBtn}>Edit Profile</button>
    </div>
  );
}
