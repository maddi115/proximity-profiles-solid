import { Show, createMemo } from "solid-js";
import { useProfileActions } from "../useProfileActions";
import styles from "../proximity.module.css";

/**
 * Bottom sheet displaying selected profile details and action buttons
 */
export function ProfileSheet(props) {
  // Create actions hook at component level (not inside function)
  const profileActions = createMemo(() => {
    return props.profile ? useProfileActions(props.profile.id) : null;
  });
  
  const handleButtonClick = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    
    const actions = profileActions();
    if (!actions) return;
    
    // Call the action by name
    switch(actionName) {
      case 'pulse':
        actions.handlePulse(e);
        break;
      case 'reveal':
        actions.handleReveal(e);
        break;
      case 'slap':
        actions.handleSlap(e);
        break;
      case 'follow':
        actions.handleFollow(e);
        break;
    }
  };
  
  return (
    <Show when={props.profile}>
      {(profile) => (
        <div class={styles.sheet} onClick={(e) => e.stopPropagation()}>
          <div class={styles.sheetHandle} />
          
          <div class={styles.sheetProfile}>
            <img 
              src={profile().img} 
              class={styles.sheetAvatar} 
              alt={`${profile().name}'s avatar`}
            />
            <div class={styles.sheetBalance}>
              ${Number(profile().balance || 0).toFixed(2)}
            </div>
          </div>
          
          <div class={styles.sheetActions}>
            <button 
              class={styles.sheetBtn} 
              onClick={(e) => handleButtonClick(e, 'pulse')}
              aria-label="Send pulse"
            >
              <span class={styles.sheetEmoji}>❤️</span>
              <span>Pulse</span>
              <span class={styles.sheetCost}>$1</span>
            </button>
            
            <button 
              class={styles.sheetBtn} 
              onClick={(e) => handleButtonClick(e, 'reveal')}
              aria-label="Reveal profile"
            >
              <span class={styles.sheetEmoji}>📸</span>
              <span>Reveal</span>
              <span class={styles.sheetCost}>$5</span>
            </button>
            
            <button 
              class={styles.sheetBtn} 
              onClick={(e) => handleButtonClick(e, 'slap')}
              aria-label="Send slap"
            >
              <span class={styles.sheetEmoji}>👋</span>
              <span>Slap</span>
              <span class={styles.sheetCost}>Free</span>
            </button>
            
            <button 
              class={`${styles.sheetBtn} ${profile().isFollowing ? styles.sheetFollowing : ''}`}
              onClick={(e) => handleButtonClick(e, 'follow')}
              aria-label={profile().isFollowing ? "Unfollow" : "Follow"}
            >
              <span class={styles.sheetEmoji}>
                {profile().isFollowing ? "⭐" : "+"}
              </span>
              <span>{profile().isFollowing ? "Following" : "Follow"}</span>
            </button>
          </div>
        </div>
      )}
    </Show>
  );
}
