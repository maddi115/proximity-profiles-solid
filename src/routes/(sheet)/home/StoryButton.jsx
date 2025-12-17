import { useNavigate } from '@solidjs/router';
import { authStore } from '../../../features/auth/store/authStore';
import styles from './StoryButton.module.css';

export function StoryButton() {
  const navigate = useNavigate();
  
  const myAvatar = () => {
    if (authStore.user?.user_metadata?.avatar_url) {
      return authStore.user.user_metadata.avatar_url;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.id}`;
  };

  return (
    <button 
      class={styles.storyButton}
      onClick={() => navigate('/home/my-story')}
    >
      <div class={styles.avatarContainer}>
        <img 
          src={myAvatar()} 
          class={styles.avatar}
          alt="Your story" 
        />
        <div class={styles.plusIcon}>+</div>
      </div>
      <span class={styles.label}>my story</span>
    </button>
  );
}
