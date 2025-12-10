import { Show } from "solid-js";
import { profileStore, profileActions } from "../features/profile/store/profileStore";
import { ProfileHeader } from "../features/profile/components/ProfileHeader";
import { ProfileStats } from "../features/profile/components/ProfileStats";
import { Card } from "../features/profile/components/Card";
import { activityStore } from "../features/notifications/store/activityStore";
import styles from "./routes.module.css";

/**
 * UserProfile - Full profile page with edit mode
 */
export default function UserProfile() {
  const recentActivities = () => activityStore.activities.slice(0, 5);
  
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };
  
  const toggleEdit = () => {
    profileActions.setEditing(!profileStore.isEditing);
  };
  
  return (
    <div class={styles.pageContent}>
      <div class={styles.pageHeader}>
        <h2 class={styles.pageTitle}>Profile</h2>
        <button 
          class={styles.editBtn}
          onClick={toggleEdit}
        >
          {profileStore.isEditing ? '✕ Cancel' : '✏️ Edit'}
        </button>
      </div>
      
      <ProfileHeader />
      <ProfileStats />
      
      <Card title="Recent Activity">
        <Show 
          when={recentActivities().length > 0}
          fallback={
            <div class={styles.emptyState}>
              <p class={styles.emptyText}>No activity yet</p>
            </div>
          }
        >
          <div class={styles.activityList}>
            {recentActivities().map(activity => (
              <div class={styles.activityItem}>
                <span class={styles.activityEmoji}>{activity.emoji}</span>
                <div class={styles.activityInfo}>
                  <div class={styles.activityAction}>{activity.action}</div>
                  <div class={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </Show>
      </Card>
      
      <Card title="Account Info">
        <div class={styles.infoGrid}>
          <div class={styles.infoItem}>
            <div class={styles.infoLabel}>Email</div>
            <div class={styles.infoValue}>{profileStore.user.email}</div>
          </div>
          <div class={styles.infoItem}>
            <div class={styles.infoLabel}>Joined</div>
            <div class={styles.infoValue}>
              {profileStore.user.joinedDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
