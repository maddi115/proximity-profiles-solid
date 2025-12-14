import { For, Show } from 'solid-js';
import { activityStore } from '../../features/notifications/store/activityStore';
import { store as proximityStore } from '../../features/proximity/store/proximityStore';
import { profiles } from '../../features/proximity/mockData';
import styles from '../routes.module.css';

export default function ActivityHistory() {
  const activities = () => activityStore.activities;

  const getProfile = (activity) => {
    // Get profileId from targetProfile.id
    const profileId = activity.targetProfile?.id;
    if (!profileId) return null;
    
    const storeProfile = proximityStore.profiles.find(p => p.id === profileId);
    if (storeProfile) {
      const mockProfile = profiles.find(p => p.id === profileId);
      return { ...mockProfile, ...storeProfile };
    }
    return profiles.find(p => p.id === profileId);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getActionEmoji = (type) => {
    switch (type) {
      case 'pulse': return '❤️';
      case 'reveal': return '📸';
      case 'slap': return '👋';
      case 'follow': return '⭐';
      case 'unfollow': return '➖';
      default: return '❓';
    }
  };

  const getActionText = (type) => {
    switch (type) {
      case 'pulse': return 'Pulsed';
      case 'reveal': return 'Revealed';
      case 'slap': return 'Slapped';
      case 'follow': return 'Followed';
      case 'unfollow': return 'Unfollowed';
      default: return type || 'Unknown';
    }
  };

  const getCostDisplay = (activity) => {
    switch (activity.type) {
      case 'pulse': return '-$1.00';
      case 'reveal': return '-$5.00';
      case 'slap': return 'Free';
      case 'follow': return 'Free';
      case 'unfollow': return 'Free';
      default: return '';
    }
  };

  return (
    <div class={styles.pageContent}>
      <h1 class={styles.pageTitle}>Activity History</h1>
      
      <Show
        when={activities().length > 0}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyIcon}>📭</div>
            <p class={styles.emptyText}>No activity yet</p>
            <p class={styles.emptySubtext}>Your interactions will appear here</p>
          </div>
        }
      >
        <div class={styles.activityList}>
          <For each={activities()}>
            {(activity) => {
              const profile = getProfile(activity);
              return (
                <div class={styles.activityItem}>
                  <img 
                    src={profile?.img} 
                    class={styles.activityProfilePic} 
                    alt={profile?.name} 
                  />
                  <div class={styles.activityInfo}>
                    <div class={styles.activityName}>{profile?.name}</div>
                    <div class={styles.activityAction}>
                      <span class={styles.activityEmoji}>{getActionEmoji(activity.type)}</span>
                      {getActionText(activity.type)}
                    </div>
                    <div class={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                  </div>
                  <div class={styles.activityCost}>
                    {getCostDisplay(activity)}
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
