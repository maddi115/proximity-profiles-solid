import { Show, For } from "solid-js";
import { activityStore } from "../features/notifications/store/activityStore";
import { store } from "../features/proximity/store/proximityStore";
import { profiles } from "../features/proximity/mockData";
import styles from "./routes.module.css";

export default function ActivityHistory() {
  const activities = () => activityStore.activities;
  
  // Fetch profile by ID when needed (not stored)
  const getProfile = (profileId) => {
    const storeProfile = store.profiles.find(p => p.id === profileId);
    if (storeProfile) return storeProfile;
    return profiles.find(p => p.id === profileId);
  };
  
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };
  
  const getCostDisplay = (activity) => {
    if (activity.cost === 0) return 'Free';
    return `$${activity.cost}`;
  };
  
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>Activity History</h2>
      
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
              const profile = getProfile(activity.profileId);
              return (
                <div class={styles.activityItem}>
                  <div class={styles.activityIconCircle}>
                    <span class={styles.activityEmoji}>{activity.emoji}</span>
                  </div>
                  
                  <div class={styles.activityInfo}>
                    <div class={styles.activityAction}>{activity.action}</div>
                    <div class={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                  </div>
                  
                  <Show when={profile}>
                    <img 
                      src={profile.img} 
                      alt={profile.name}
                      class={styles.activityProfilePic}
                      loading="lazy"
                    />
                  </Show>
                  
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
