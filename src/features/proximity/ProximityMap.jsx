import { createSignal, onMount, Show } from "solid-js";
import { profiles } from "./data";
import { proximityActions, store } from "../../store/proximityStore";
import { AppleWatchGrid } from "./components/AppleWatchGrid";
import { useProfileActions } from "./useProfileActions";
import styles from "./proximity.module.css";

export function ProximityMap() {
  const [selectedProfile, setSelectedProfile] = createSignal(profiles[0]); // Default to first profile
  
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });
  
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };
  
  const getStoreProfile = () => {
    const selected = selectedProfile();
    if (!selected) return null;
    return store.profiles.find(p => p.id === selected.id) || selected;
  };
  
  const actions = () => selectedProfile() ? useProfileActions(selectedProfile().id) : null;

  return (
    <div>
      <AppleWatchGrid 
        profiles={profiles} 
        onProfileClick={handleProfileClick}
      />
      
      {/* Always visible bottom panel */}
      <Show when={selectedProfile()}>
        <div class={styles.sheet}>
          <div class={styles.sheetHandle} />
          
          <div class={styles.sheetProfile}>
            <img src={getStoreProfile()?.img || selectedProfile().img} class={styles.sheetAvatar} />
            <div class={styles.sheetBalance}>${(getStoreProfile()?.balance || 0).toFixed(2)}</div>
          </div>
          
          <div class={styles.sheetActions}>
            <button class={styles.sheetBtn} onClick={(e) => actions()?.handlePulse(e)}>
              <span class={styles.sheetEmoji}>❤️</span>
              <span>Pulse</span>
              <span class={styles.sheetCost}>$1</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => actions()?.handleReveal(e)}>
              <span class={styles.sheetEmoji}>📸</span>
              <span>Reveal</span>
              <span class={styles.sheetCost}>$5</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => actions()?.handleSlap(e)}>
              <span class={styles.sheetEmoji}>👋</span>
              <span>Slap</span>
              <span class={styles.sheetCost}>Free</span>
            </button>
            
            <button 
              class={`${styles.sheetBtn} ${getStoreProfile()?.isFollowing ? styles.sheetFollowing : ''}`}
              onClick={(e) => actions()?.handleFollow(e)}
            >
              <span class={styles.sheetEmoji}>{getStoreProfile()?.isFollowing ? "⭐" : "+"}</span>
              <span>{getStoreProfile()?.isFollowing ? "Following" : "Follow"}</span>
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
