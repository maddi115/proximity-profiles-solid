import { For, Show } from 'solid-js';
import styles from './proximityList.module.css';

/**
 * ProximityList - List view of nearby profiles
 */
export function ProximityList(props) {
  return (
    <Show
      when={props.profiles?.length > 0}
      fallback={
        <div class={styles.emptyState}>
          No one nearby
        </div>
      }
    >
      <div class={styles.proximityList}>
        <For each={props.profiles}>
          {(profile) => (
            <div 
              class={styles.proximityItem}
              onClick={() => props.onProfileClick?.(profile)}
            >
              <div class={styles.proximityIcon}>
                {profile.emoji || '👤'}
              </div>
              <div class={styles.proximityInfo}>
                <div class={styles.proximityName}>{profile.name}</div>
                <div class={styles.proximityDistance}>{profile.distance}</div>
              </div>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
