import { useLocation, useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import { SelectedProfileCard } from '../SelectedProfileCard';
import { ProfileActions } from '../ProfileActions';
import { BlurredBackground } from '../../../../features/proximity/components/BlurredBackground';
import styles from '../home.module.css';
import followingStyles from './following.module.css';

export default function ViewingProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = () => location.state?.profile;

  return (
    <Show when={profile()}>
      {(p) => (
        <div class={styles.homeContent}>
          <button 
            class={styles.messagesBtn}
            onClick={() => navigate('/home/following')}
          >
            ← Back to Following
          </button>

          <div class={styles.backgroundContainer}>
            <BlurredBackground src={p().img} blurAmount={20} scale={1.2} />
          </div>
          
          <div class={followingStyles.contextBanner}>
            <span class={followingStyles.contextText}>
              ⭐ Following
            </span>
          </div>

          <SelectedProfileCard profile={p()} />
          <ProfileActions profile={p()} />
        </div>
      )}
    </Show>
  );
}
