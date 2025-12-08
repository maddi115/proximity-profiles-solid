import { Show, For } from "solid-js";
import { activityStore } from "../features/notifications/store/activityStore";
import styles from "./routes.module.css";

/**
 * Activity History - Shows all user actions
 */
export default function ActivityHistory() {
  const activities = () => activityStore.activities;
  
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds
    
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
            {(activity) => (
              <div class={styles.activityItem}>
                <div class={styles.activityIconCircle}>
                  <span class={styles.activityEmoji}>{activity.emoji}</span>
                </div>
                
                <div class={styles.activityInfo}>
                  <div class={styles.activityAction}>{activity.action}</div>
                  <div class={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                </div>
                
                <Show when={activity.targetProfile}>
                  <img 
                    src={activity.targetProfile.image} 
                    alt={activity.targetProfile.name}
                    class={styles.activityProfilePic}
                  />
                </Show>
                
                <div class={styles.activityCost}>
                  {getCostDisplay(activity)}
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
