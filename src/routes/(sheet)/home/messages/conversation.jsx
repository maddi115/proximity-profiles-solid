import { For, Show } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { authStore } from '../../../../features/auth/store/DB_authStore';
import styles from '../../../routes.module.css';
import homeStyles from '../home.module.css';
import messageStyles from './messages.module.css';

export default function Conversation() {
  const navigate = useNavigate();
  const location = useLocation();
  const conversation = () => location.state?.conversation;
  const profile = () => location.state?.profile;
  const currentUser = () => authStore.user;

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleMessageClick = (message) => {
    navigate('/home/messages/viewing-profile', {
      state: { profile: profile(), message }
    });
  };

  const myAvatar = () => currentUser()?.user_metadata?.avatar_url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser()?.id}`;

  return (
    <div class={styles.pageContent}>
      <button
        class={homeStyles.messagesBtn}
        onClick={() => navigate('/home/messages')}
      >
        ← Back to Messages
      </button>

      <div class={messageStyles.header}>
        <h1 class={styles.pageTitle}>Conversation with {profile()?.name}</h1>
      </div>

      <Show when={conversation()?.messages}>
        <div class={messageStyles.conversationList}>
          <For each={conversation().messages}>
            {(message) => {
              const isSent = message.direction === 'sent';
              
              return (
                <div
                  class={messageStyles.conversationCard}
                  onClick={() => handleMessageClick(message)}
                >
                  <img
                    src={isSent ? myAvatar() : profile()?.img}
                    class={messageStyles.conversationAvatar}
                    alt={isSent ? "You" : profile()?.name}
                  />
                  
                  <span class={messageStyles.emoji}>{message.emoji}</span>
                  <span class={messageStyles.action}>{message.action}</span>
                  
                  <img
                    src={isSent ? profile()?.img : myAvatar()}
                    class={messageStyles.conversationAvatar}
                    alt={isSent ? profile()?.name : "You"}
                  />
                  
                  <span class={messageStyles.timestamp}>{formatTime(message.timestamp)}</span>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
