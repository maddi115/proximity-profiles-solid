import { authStore } from "../../../../../features/auth/store/DB_authStore";
import styles from "../island.module.css";

/**
 * CompactMode - Shows avatars with "really close to" text
 */
export function CompactMode(props) {
  const myAvatar = () => {
    if (authStore.user?.user_metadata?.avatar_url) {
      return authStore.user.user_metadata.avatar_url;
    }
    // Fallback if not logged in
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123';
  };
  
  // Placeholder avatar for other user
  const placeholderAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder456';

  return (
    <div class={styles.compactMode}>
      <img 
        src={myAvatar()} 
        class={styles.avatarCompact}
        alt="You" 
      />
      <span class={styles.proximityText}>really close to</span>
      <img 
        src={placeholderAvatar} 
        class={styles.avatarCompact}
        alt="Nearby user" 
      />
    </div>
  );
}
