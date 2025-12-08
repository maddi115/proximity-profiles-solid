import { Show, createMemo, createSignal, createEffect } from "solid-js";
import { useProfileActions } from "../hooks/useProfileActions";
import { BlurredBackground } from "./BlurredBackground";
import { DynamicIsland } from "../../dynamicIsland/components/DynamicIsland";
import { extractDominantColor } from "../utils/extractDominantColor";
import { Menu } from "../../menu/Menu";
import styles from "../proximity.module.css";

/**
 * Bottom sheet displaying selected profile details and action buttons
 * Includes DynamicIsland positioned at top center
 */
export function ProfileSheet(props) {
  const [glowColor, setGlowColor] = createSignal('139, 92, 246');
  
  const profileActions = createMemo(() => {
    return props.profile ? useProfileActions(props.profile.id) : null;
  });
  
  createEffect(async () => {
    const profile = props.profile;
    if (profile && profile.img) {
      try {
        const color = await extractDominantColor(profile.img);
        setGlowColor(color);
      } catch (err) {
        console.error('Failed to extract color:', err);
        setGlowColor('139, 92, 246');
      }
    }
  });
  
  const handleButtonClick = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    
    const actions = profileActions();
    if (!actions) return;
    
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
        <>
          {/* Dynamic Island positioned above sheet */}
          <div class={styles.islandContainer}>
            <DynamicIsland />
          </div>
          
          {/* Profile Sheet */}
          <div 
            class={styles.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <BlurredBackground src={profile().img} blurAmount={20} scale={1.2} />
            
            <div class={styles.sheetContent}>
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
              
              <div class={styles.sheetFooter}>
                <Menu />
              </div>
            </div>
          </div>
        </>
      )}
    </Show>
  );
}
