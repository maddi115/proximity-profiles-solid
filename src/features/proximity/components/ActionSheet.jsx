import { Show, createSignal } from "solid-js";
import styles from "./actionSheet.module.css";

export function ActionSheet(props) {
  const [isOpen, setIsOpen] = createSignal(false);
  
  const toggle = () => setIsOpen(!isOpen());
  const close = () => setIsOpen(false);
  
  return (
    <>
      {/* Backdrop */}
      <Show when={isOpen()}>
        <div class={styles.backdrop} onClick={close} />
      </Show>
      
      {/* Bottom Sheet */}
      <div class={`${styles.sheet} ${isOpen() ? styles.open : ''}`}>
        <div class={styles.handle} />
        
        <div class={styles.profile}>
          <img src={props.profile.img} class={styles.avatar} />
          <div class={styles.balance}>${props.profile.balance.toFixed(2)}</div>
        </div>
        
        <div class={styles.actions}>
          <button class={styles.actionBtn} onClick={props.onPulse}>
            <span class={styles.emoji}>❤️</span>
            <span class={styles.label}>Pulse</span>
            <span class={styles.cost}>$1.00</span>
          </button>
          
          <button class={styles.actionBtn} onClick={props.onReveal}>
            <span class={styles.emoji}>📸</span>
            <span class={styles.label}>Reveal</span>
            <span class={styles.cost}>$5.00</span>
          </button>
          
          <button class={styles.actionBtn} onClick={props.onSlap}>
            <span class={styles.emoji}>👋</span>
            <span class={styles.label}>Slap</span>
            <span class={styles.cost}>Free</span>
          </button>
          
          <button 
            class={`${styles.actionBtn} ${props.profile.isFollowing ? styles.following : ''}`} 
            onClick={props.onFollow}
          >
            <span class={styles.emoji}>{props.profile.isFollowing ? "⭐" : "+"}</span>
            <span class={styles.label}>{props.profile.isFollowing ? "Following" : "Follow"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
