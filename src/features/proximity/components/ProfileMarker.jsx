import { Show, createSignal } from "solid-js";
import { store } from "../../../store/proximityStore.js";
import { useProfileActions } from "../useProfileActions"; 
import styles from "../proximity.module.css";

export function ProfileMarker(props) {
  const profileId = props.profile.id;
  const profile = () => store.profiles.find(p => p.id === profileId) || props.profile;
  
  const [showSheet, setShowSheet] = createSignal(false);
  const actions = useProfileActions(profileId);

  const handleClick = () => {
    setShowSheet(true);
  };

  return (
    <>
      <div
        ref={actions.setMarkerRef}
        class={styles.marker}
        style={{ top: profile().top, left: profile().left }}
        onClick={handleClick}
      >
        <img 
          src={profile().img} 
          class={styles["marker-img"]} 
          loading="lazy" 
        />

        <Show when={profile().balance >= 100}>
          <div class={styles["balance-badge"]}>
            🤍 ${profile().balance.toFixed(0)}
          </div>
        </Show>

        <Show when={profile().isFollowing}>
          <div class={styles["following-badge"]}>⭐</div>
        </Show>

        <Show when={profile().lastReaction}>
          <div class={styles["sent-msg"]}>
            {profile().lastReaction}
          </div>
        </Show>
      </div>

      {/* Bottom Sheet - Opens on click */}
      <Show when={showSheet()}>
        <div class={styles.backdrop} onClick={() => setShowSheet(false)} />
        <div class={styles.sheet}>
          <div class={styles.sheetHandle} />
          
          <div class={styles.sheetProfile}>
            <img src={profile().img} class={styles.sheetAvatar} />
            <div class={styles.sheetBalance}>${profile().balance.toFixed(2)}</div>
          </div>
          
          <div class={styles.sheetActions}>
            <button class={styles.sheetBtn} onClick={(e) => { actions.handlePulse(e); setShowSheet(false); }}>
              <span class={styles.sheetEmoji}>❤️</span>
              <span>Pulse</span>
              <span class={styles.sheetCost}>$1</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => { actions.handleReveal(e); setShowSheet(false); }}>
              <span class={styles.sheetEmoji}>📸</span>
              <span>Reveal</span>
              <span class={styles.sheetCost}>$5</span>
            </button>
            
            <button class={styles.sheetBtn} onClick={(e) => { actions.handleSlap(e); setShowSheet(false); }}>
              <span class={styles.sheetEmoji}>👋</span>
              <span>Slap</span>
              <span class={styles.sheetCost}>Free</span>
            </button>
            
            <button 
              class={`${styles.sheetBtn} ${profile().isFollowing ? styles.sheetFollowing : ''}`}
              onClick={(e) => { actions.handleFollow(e); setShowSheet(false); }}
            >
              <span class={styles.sheetEmoji}>{profile().isFollowing ? "⭐" : "+"}</span>
              <span>{profile().isFollowing ? "Following" : "Follow"}</span>
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
