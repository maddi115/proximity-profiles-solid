import styles from "./proximity.module.css";

/**
 * ProximityList - Displays list of nearby people
 * Reusable in DynamicIsland, full page, or anywhere
 */
export function ProximityList(props) {
  return (
    <div class={styles.proximityList}>
      {props.hits.length === 0 ? (
        <div class={styles.emptyState}>No one nearby</div>
      ) : (
        props.hits.map(hit => (
          <div 
            class={styles.proximityItem}
            onClick={() => props.onSelect?.(hit.profileId)}
          >
            <span class={styles.proximityIcon}>👤</span>
            <div class={styles.proximityInfo}>
              <div class={styles.proximityName}>
                Profile {hit.profileId}
              </div>
              <div class={styles.proximityDistance}>
                📍 {hit.distance}ft away
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
