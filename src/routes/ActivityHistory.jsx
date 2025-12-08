import styles from "./routes.module.css";

export default function ActivityHistory() {
  const activities = [
    { emoji: '❤️', action: 'Pulse to Alex', cost: '$1', time: '2m ago' },
    { emoji: '📸', action: 'Reveal from Jamie', cost: '$5', time: '1h ago' },
    { emoji: '👋', action: 'Slap to Taylor', cost: 'Free', time: '3h ago' },
  ];
  
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>Activity History</h2>
      
      <div class={styles.activityList}>
        {activities.map(activity => (
          <div class={styles.activityItem}>
            <span class={styles.activityEmoji}>{activity.emoji}</span>
            <div class={styles.activityInfo}>
              <div class={styles.activityAction}>{activity.action}</div>
              <div class={styles.activityTime}>{activity.time}</div>
            </div>
            <div class={styles.activityCost}>{activity.cost}</div>
          </div>
        ))}
      </div>
      
      <p class={styles.emptyText}>More activity will appear here</p>
    </div>
  );
}
