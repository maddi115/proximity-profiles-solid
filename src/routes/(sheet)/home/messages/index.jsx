import { For, Show, createMemo } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { messagesActions } from '../../../../features/messages/store/messagesStore';
import { store as proximityStore } from '../../../../features/proximity/store/proximityStore';
import { profiles } from '../../../../features/proximity/mockData';
import { authStore } from '../../../../features/auth/store/authStore';
import { getProfileIdAsNumber } from '../../../../types/activity';
import styles from '../../../routes.module.css';
import messageStyles from './messages.module.css';

export default function Messages() {
  const navigate = useNavigate();
  const messages = createMemo(() => messagesActions.getAllMessages());
  const currentUser = () => authStore.user;

  const getProfile = (activity) => {
    const profileId = getProfileIdAsNumber(activity);
    if (!profileId) return null;

    const storeProfile = proximityStore.profiles.find(p => p.id === profileId);
    if (storeProfile) {
      const mockProfile = profiles.find(p => p.id === profileId);
      return { ...mockProfile, ...storeProfile };
    }

    return profiles.find(p => p.id === profileId);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleMessageClick = (message) => {
    const profile = getProfile(message);
    navigate('/home/messages/viewing-profile', { 
      state: { profile, message } 
    });
  };

  return (
    <div class={styles.pageContent}>
      <div class={messageStyles.header}>
        <h1 class={styles.pageTitle}>Messages</h1>
      </div>

      <Show
        when={messages().length > 0}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyIcon}>💬</div>
            <p class={styles.emptyText}>No messages yet</p>
            <p class={styles.emptySubtext}>Your reactions will appear here</p>
          </div>
        }
      >
        <div class={styles.activityList}>
          <For each={messages()}>
            {(message) => {
              const profile = getProfile(message);
              const myAvatar = currentUser()?.user_metadata?.avatar_url || 
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser()?.id}`;
              
              return (
                <div 
                  class={messageStyles.messageItem}
                  onClick={() => handleMessageClick(message)}
                >
                  {message.direction === 'sent' ? (
                    <>
                      <img
                        src={myAvatar}
                        class={styles.activityProfilePic}
                        alt="You"
                      />
                      <div class={styles.activityInfo}>
                        <div class={messageStyles.messageFlow}>
                          <span class={messageStyles.fromName}>You</span>
                          <span class={messageStyles.arrow}>→</span>
                          <span class={styles.activityEmoji}>{message.emoji}</span>
                          <span class={messageStyles.actionText}>{message.action}</span>
                          <span class={messageStyles.arrow}>→</span>
                          <span class={messageStyles.toName}>{profile?.name}</span>
                        </div>
                        <div class={styles.activityTime}>{formatTime(message.timestamp)}</div>
                      </div>
                      <img
                        src={profile?.img}
                        class={styles.activityProfilePic}
                        alt={profile?.name}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={profile?.img}
                        class={styles.activityProfilePic}
                        alt={profile?.name}
                      />
                      <div class={styles.activityInfo}>
                        <div class={messageStyles.messageFlow}>
                          <span class={messageStyles.fromName}>{profile?.name}</span>
                          <span class={messageStyles.arrow}>→</span>
                          <span class={styles.activityEmoji}>{message.emoji}</span>
                          <span class={messageStyles.actionText}>{message.action}</span>
                          <span class={messageStyles.arrow}>→</span>
                          <span class={messageStyles.toName}>You</span>
                        </div>
                        <div class={styles.activityTime}>{formatTime(message.timestamp)}</div>
                      </div>
                      <img
                        src={myAvatar}
                        class={styles.activityProfilePic}
                        alt="You"
                      />
                    </>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
