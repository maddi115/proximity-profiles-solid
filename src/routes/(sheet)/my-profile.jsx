import { Show, For } from 'solid-js';
import { profileStore, profileActions } from '../../features/profile/store/profileStore';
import { activityStore } from '../../features/notifications/store/activityStore';
import { ProfileHeader } from '../../features/profile/components/ProfileHeader';
import { ProfileStats } from '../../features/profile/components/ProfileStats';
import { Card } from '../../features/profile/components/Card';
import styles from '../routes.module.css';

export default function UserProfile() {
  const recentActivities = () => activityStore.activities.slice(0, 5);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const toggleEdit = () => {
    profileActions.setEditing(!profileStore.isEditing);
  };

  return (
    <div class={styles.pageContent}>
      <h1 class={styles.pageTitle}>Profile</h1>

      <ProfileHeader />
      <ProfileStats />

      <Card title="Recent Activity">
        <Show
          when={recentActivities().length > 0}
          fallback={<p class={styles.emptyText}>No recent activity</p>}
        >
          <div class={styles.activityList}>
            <For each={recentActivities()}>
              {(activity) => (
                <div class={styles.activityItem}>
                  <span class={styles.activityEmoji}>
                    {activity.action === 'pulse' && '❤️'}
                    {activity.action === 'reveal' && '📸'}
                    {activity.action === 'slap' && '👋'}
                    {activity.action === 'follow' && '⭐'}
                  </span>
                  <div class={styles.activityInfo}>
                    <div class={styles.activityAction}>{activity.action}</div>
                    <div class={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Card>

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
