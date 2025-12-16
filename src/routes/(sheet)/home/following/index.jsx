import { For, Show, createMemo } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { followingActions } from '../../../../features/following/store/followingStore';
import styles from '../../../routes.module.css';
import homeStyles from '../home.module.css';
import followingStyles from './following.module.css';

export default function Following() {
  const navigate = useNavigate();
  const followingProfiles = createMemo(() => followingActions.getFollowingProfiles());

  const handleProfileClick = (profile) => {
    navigate('/home/following/viewing-profile', {
      state: { profile }
    });
  };

  return (
    <div class={styles.pageContent}>
      <button
        class={homeStyles.messagesBtn}
        onClick={() => navigate('/home')}
      >
        ← Back Home
      </button>

      <div class={followingStyles.header}>
        <h1 class={styles.pageTitle}>Following</h1>
        <span class={followingStyles.count}>{followingProfiles().length} people</span>
      </div>

      <Show
        when={followingProfiles().length > 0}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyIcon}>👥</div>
            <p class={styles.emptyText}>Not following anyone yet</p>
            <p class={styles.emptySubtext}>Follow people to see them here</p>
          </div>
        }
      >
        <div class={followingStyles.followingList}>
          <For each={followingProfiles()}>
            {(profile) => (
              <div
                class={followingStyles.profileCard}
                onClick={() => handleProfileClick(profile)}
              >
                <img
                  src={profile.img}
                  class={followingStyles.avatar}
                  alt={profile.name}
                />
                <div class={followingStyles.profileInfo}>
                  <div class={followingStyles.profileName}>{profile.name}</div>
                  <div class={followingStyles.profileStats}>
                    {profile.distance && (
                      <span class={followingStyles.stat}>
                        <span class={followingStyles.statIcon}>📍</span>
                        {profile.distance}m away
                      </span>
                    )}
                    {profile.online && (
                      <span class={followingStyles.onlineBadge}>● Online</span>
                    )}
                  </div>
                </div>
                <div class={followingStyles.arrow}>→</div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
