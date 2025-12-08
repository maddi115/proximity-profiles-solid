import { ProximityList } from "../../../proximity/components/ProximityList";
import styles from "../island.module.css";

/**
 * ProximityMode - Expanded view showing nearby people
 */
export function ProximityMode(props) {
  return (
    <div class={styles.proximityMode}>
      <div class={styles.modeHeader}>
        <span>Nearby</span>
        <button class={styles.collapseBtn} onClick={props.onCollapse}>✕</button>
      </div>
      
      <ProximityList 
        hits={props.hits}
        onSelect={props.onSelectProfile}
      />
      
      {props.hits.length > 0 && (
        <button class={styles.historyBtn} onClick={props.onShowHistory}>
          View History →
        </button>
      )}
    </div>
  );
}
