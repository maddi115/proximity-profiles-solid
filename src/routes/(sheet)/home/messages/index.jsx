import { For, Show, createMemo } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { messagesActions } from '../../../../features/messages/store/messagesStore';
import { store as proximityStore } from '../../../../features/proximity/store/proximityStore';
import { profiles } from '../../../../features/proximity/mockData';
import { authStore } from '../../../../features/auth/store/DB_authStore';
import styles from '../../../routes.module.css';
import homeStyles from '../home.module.css';
import messageStyles from './messages.module.css';

export default function Messages() {
  const navigate = useNavigate();
  const conversations = createMemo(() => messagesActions.getGroupedConversations());
  const currentUser = () => authStore.user;

  const getProfile = (profileId) => {
    const id = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
    const storeProfile = proximityStore.profiles.find(p => p.id === id);
    if (storeProfile) {
      const mockProfile = profiles.find(p => p.id === id);
      return { ...mockProfile, ...storeProfile };
    }
    return profiles.find(p => p.id === id);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleConversationClick = (conversation) => {
    const profile = getProfile(conversation.profileId);
    navigate('/home/messages/conversation', {
      state: { profile, conversation }
    });
  };

  const myAvatar = () => currentUser()?.user_metadata?.avatar_url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser()?.id}`;

  return (
    <div class={styles.pageContent}>
      <button
        class={homeStyles.messagesBtn}
        onClick={() => navigate('/home')}
      >
        ← Back Home
      </button>

      <div class={messageStyles.header}>
        <h1 class={styles.pageTitle}>Messages</h1>
      </div>

      <Show
        when={conversations().length > 0}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyIcon}>💬</div>
            <p class={styles.emptyText}>No messages yet</p>
            <p class={styles.emptySubtext}>Your reactions will appear here</p>
          </div>
        }
      >
        <div class={messageStyles.conversationList}>
          <For each={conversations()}>
            {(conversation) => {
              const profile = getProfile(conversation.profileId);
              const latest = conversation.latestMessage;
              const isSent = latest.direction === 'sent';

              return (
                <div
                  class={messageStyles.conversationCard}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <img
                    src={isSent ? myAvatar() : profile?.img}
                    class={messageStyles.conversationAvatar}
                    alt={isSent ? "You" : profile?.name}
                  />
                  
                  <span class={messageStyles.emoji}>{latest.emoji}</span>
                  <span class={messageStyles.action}>{latest.action}</span>
                  
                  <img
                    src={isSent ? profile?.img : myAvatar()}
                    class={messageStyles.conversationAvatar}
                    alt={isSent ? profile?.name : "You"}
                  />
                  
                  <span class={messageStyles.timestamp}>{formatTime(latest.timestamp)}</span>
                  
                  <span class={messageStyles.messageCount}>
                    {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
                  </span>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
