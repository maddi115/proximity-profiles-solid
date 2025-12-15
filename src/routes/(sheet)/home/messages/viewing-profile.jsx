import { useLocation } from '@solidjs/router';
import { Show } from 'solid-js';
import { SelectedProfileCard } from '../SelectedProfileCard';
import { ProfileActions } from '../ProfileActions';
import { BlurredBackground } from '../../../../features/proximity/components/BlurredBackground';
import styles from '../home.module.css';
import messageStyles from './messages.module.css';

export default function ViewingProfile() {
  const location = useLocation();
  const profile = () => location.state?.profile;
  const message = () => location.state?.message;

  const getActionText = () => {
    const msg = message();
    if (!msg) return '';
    return `${msg.emoji} ${msg.action}`;
  };

  return (
    <Show when={profile()}>
      {(p) => (
        <div class={styles.homeContent}>
          <div class={styles.backgroundContainer}>
            <BlurredBackground src={p().img} blurAmount={20} scale={1.2} />
          </div>
          
          <div class={messageStyles.contextBanner}>
            <span class={messageStyles.contextText}>
              From message: {getActionText()}
            </span>
          </div>

          <SelectedProfileCard profile={p()} />
          <ProfileActions profile={p()} />
        </div>
      )}
    </Show>
  );
}
