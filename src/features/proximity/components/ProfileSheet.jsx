import { Show, createMemo, createSignal, createEffect } from "solid-js";
import { useProfileActions } from "../hooks/useProfileActions";
import { BlurredBackground } from "./BlurredBackground";
import { extractDominantColor } from "../utils/extractDominantColor";
import { Menu } from "../../menu/Menu";
import { Dashboard } from "../../menu/pages/Dashboard";
import { UserProfile } from "../../menu/pages/UserProfile";
import { Settings } from "../../menu/pages/Settings";
import { ActivityHistory } from "../../menu/pages/ActivityHistory";
import styles from "../proximity.module.css";

/**
 * Bottom sheet with profile info and menu navigation
 */
export function ProfileSheet(props) {
  const [glowColor, setGlowColor] = createSignal('139, 92, 246');
  const [currentView, setCurrentView] = createSignal('profile');
  
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
  
  const handleNavigate = (page) => {
    setCurrentView(page);
  };
  
  return (
    <Show when={props.profile}>
      {(profile) => (
        <div 
          class={styles.sheet}
          onClick={(e) => e.stopPropagation()}
        >
          <BlurredBackground src={profile().img} blurAmount={20} scale={1.2} />
          
          <div class={styles.sheetContent}>
            {/* Profile View (Front Page) */}
            <Show when={currentView() === 'profile'}>
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
            </Show>
            
            {/* Menu Pages */}
            <Show when={currentView() === 'dashboard'}>
              <Dashboard />
            </Show>
            <Show when={currentView() === 'userProfile'}>
              <UserProfile />
            </Show>
            <Show when={currentView() === 'settings'}>
              <Settings />
            </Show>
            <Show when={currentView() === 'activity'}>
              <ActivityHistory />
            </Show>
            
            {/* Footer with Menu only */}
            <div class={styles.sheetFooter}>
              <Menu 
                onNavigate={handleNavigate} 
                currentView={currentView()}
              />
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
