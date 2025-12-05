import { createSignal, onMount, Show, createMemo } from "solid-js";
import { profiles } from "./data";
import { proximityActions, store } from "../../store/proximityStore";
import { AppleWatchGrid } from "./components/AppleWatchGrid";
import { useProfileActions } from "./useProfileActions";
import styles from "./proximity.module.css";

export function ProximityMap() {
  const [selectedProfile, setSelectedProfile] = createSignal(profiles[0]);
  
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });
  
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };
  
  const handleAutoSelect = (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };
  
  const getStoreProfile = createMemo(() => {
    const selected = selectedProfile();
    if (!selected) return null;
    return store.profiles.find(p => p.id === selected.id) || selected;
  });
  
  // Create actions once and reuse
  const profileActions = createMemo(() => {
    const selected = selectedProfile();
    return selected ? useProfileActions(selected.id) : null;
  });

  const handleButtonClick = (e, actionFn) => {
    e.preventDefault();
    e.stopPropagation();
    const actions = profileActions();
    if (actions && actionFn) {
      actionFn.call(actions, e);
    }
  };

  return (
    <div>
      <AppleWatchGrid 
        profiles={profiles} 
        onProfileClick={handleProfileClick}
        onCenterProfileChange={handleAutoSelect}
      />
      
      <Show when={selectedProfile()}>
        <div class={styles.sheet} onClick={(e) => e.stopPropagation()}>
          <div class={styles.sheetHandle} />
          
          <div class={styles.sheetProfile}>
            <img src={getStoreProfile()?.img || selectedProfile().img} class={styles.sheetAvatar} />
            <div class={styles.sheetBalance}>${Number(getStoreProfile()?.balance || 0).toFixed(2)}</div>
          </div>
          
          <div class={styles.sheetActions}>
            <button class={styles.sheetBtn} onClick={(e) => handleButtonClick(e, profileActions()?.handlePulse)}>
              <span class={styles.sheetEmoji}>❤️</span>
              <span>Pulse</span>
              <span class={styles.sheetCost}>$1</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => handleButtonClick(e, profileActions()?.handleReveal)}>
              <span class={styles.sheetEmoji}>📸</span>
              <span>Reveal</span>
              <span class={styles.sheetCost}>$5</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => handleButtonClick(e, profileActions()?.handleSlap)}>
              <span class={styles.sheetEmoji}>👋</span>
              <span>Slap</span>
              <span class={styles.sheetCost}>Free</span>
            </button>
            
            <button 
              class={`${styles.sheetBtn} ${getStoreProfile()?.isFollowing ? styles.sheetFollowing : ''}`}
              onClick={(e) => handleButtonClick(e, profileActions()?.handleFollow)}
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
