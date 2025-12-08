import styles from "../island.module.css";

/**
 * CompactMode - Small pill showing nearby count
 */
export function CompactMode(props) {
  return (
    <div class={styles.compactMode} onClick={props.onExpand}>
      <span class={styles.badge}>{props.nearbyCount}</span>
      <span class={styles.label}>nearby</span>
    </div>
  );
}
