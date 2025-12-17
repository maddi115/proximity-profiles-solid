import { profileStore } from '../../features/profile/store/profileStore';
import { ProfileHeader } from '../../features/profile/components/ProfileHeader';
import { ProfileStats } from '../../features/profile/components/ProfileStats';
import { Card } from '../../features/profile/components/Card';
import styles from '../routes.module.css';

export default function UserProfile() {
  return (
    <div class={styles.pageContent}>
      <h1 class={styles.pageTitle}>Profile</h1>
      
      <ProfileHeader />
      
      <ProfileStats />
      
      <Card title="Account Info">
        <div class={styles.infoGrid}>
          <div class={styles.infoItem}>
            <span class={styles.infoLabel}>Email</span>
            <span class={styles.infoValue}>{profileStore.user.email}</span>
          </div>
          <div class={styles.infoItem}>
            <span class={styles.infoLabel}>Member Since</span>
            <span class={styles.infoValue}>
              {profileStore.user.joinedDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
