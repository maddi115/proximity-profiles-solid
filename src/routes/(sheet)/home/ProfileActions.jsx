import { createMemo } from "solid-js";
import { useProfileActions } from "../../../features/proximity/hooks/useProfileActions";
import { LoadingButton } from "../../../features/loading/components/LoadingButton";
import styles from './home.module.css';

export function ProfileActions(props) {
  const profileActions = createMemo(() => {
    return props.profile?.id ? useProfileActions(props.profile.id) : null;
  });
  
  const handleButtonClick = (e, actionName) => {
    e.preventDefault();
    const actions = profileActions();
    if (!actions) return;
    
    switch(actionName) {
      case 'pulse': actions.handlePulse(e); break;
      case 'reveal': actions.handleReveal(e); break;
      case 'slap': actions.handleSlap(e); break;
      case 'follow': actions.handleFollow(e); break;
    }
  };
  
  return (
    <div class={styles.actions}>
      <LoadingButton
        class={styles.actionBtn}
        isLoading={profileActions()?.isPulsing()}
        disabled={!profileActions()?.canAffordPulse()}
        onClick={(e) => handleButtonClick(e, 'pulse')}
        loadingText="Sending..."
      >
        <span class={styles.emoji}>❤️</span>
        <span>Pulse</span>
        <span class={styles.cost}>$1</span>
      </LoadingButton>
      
      <LoadingButton
        class={styles.actionBtn}
        isLoading={profileActions()?.isRevealing()}
        disabled={!profileActions()?.canAffordReveal()}
        onClick={(e) => handleButtonClick(e, 'reveal')}
        loadingText="Sending..."
      >
        <span class={styles.emoji}>📸</span>
        <span>Reveal</span>
        <span class={styles.cost}>$5</span>
      </LoadingButton>
      
      <LoadingButton
        class={styles.actionBtn}
        isLoading={profileActions()?.isSlapping()}
        onClick={(e) => handleButtonClick(e, 'slap')}
        loadingText="Sending..."
      >
        <span class={styles.emoji}>👋</span>
        <span>Slap</span>
        <span class={styles.cost}>Free</span>
      </LoadingButton>
      
      <LoadingButton
        class={`${styles.actionBtn} ${props.profile.isFollowing ? styles.following : ''}`}
        isLoading={profileActions()?.isFollowing()}
        onClick={(e) => handleButtonClick(e, 'follow')}
        loadingText={props.profile.isFollowing ? "Updating..." : "Following..."}
      >
        <span class={styles.emoji}>
          {props.profile.isFollowing ? "⭐" : "+"}
        </span>
        <span>{props.profile.isFollowing ? "Following" : "Follow"}</span>
      </LoadingButton>
    </div>
  );
}
