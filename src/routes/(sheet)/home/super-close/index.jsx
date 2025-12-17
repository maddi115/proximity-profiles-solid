import { For, Show, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { proximityHitsStore } from '../../../../features/proximity/store/proximityHitsStore';
import { profiles } from '../../../../features/proximity/mockData';
import { useProfileActions } from '../../../../features/proximity/hooks/useProfileActions';
import { DynamicIsland } from '../dynamicIsland';
import styles from '../../../routes.module.css';
import homeStyles from '../home.module.css';
import superCloseStyles from './super-close.module.css';

export default function SuperClose() {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = createSignal(null);
  let cameraInputRef;
  
  const getProfile = (hit) => {
    const profile = profiles.find(p => p.id === hit.profileId);
    return profile;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleWaveAndPassBy = (profile) => {
    console.log('Wave and pass by:', profile.name);
    // TODO: Implement wave action
  };

  const handleCameraClick = () => {
    cameraInputRef.click();
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
      console.log('Photo selected:', file.name);
      // TODO: Handle photo upload
    }
  };

  return (
    <div class={styles.pageContent}>
      <button
        class={superCloseStyles.backBtn}
        onClick={() => navigate('/home')}
      >
        ← Back Home
      </button>

      <div class={superCloseStyles.islandWrapper}>
        <DynamicIsland />
      </div>

      <div class={superCloseStyles.header}>
        <h1 class={styles.pageTitle}>Super Close History</h1>
        <p class={superCloseStyles.subtitle}>People you've been really close to</p>
      </div>

      <div class={superCloseStyles.cameraSection}>
        <button 
          class={superCloseStyles.cameraButton}
          onClick={handleCameraClick}
        >
          <div class={superCloseStyles.cameraIcon}>📷</div>
        </button>
        <p class={superCloseStyles.cameraText}>
          send them a picture only they can see while you're passing by
        </p>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style="display: none;"
          onChange={handlePhotoSelect}
        />
        
        <Show when={selectedPhoto()}>
          <div class={superCloseStyles.photoPreview}>
            <img 
              src={selectedPhoto()} 
              alt="Selected photo" 
              class={superCloseStyles.previewImage}
            />
          </div>
        </Show>
      </div>

      <Show
        when={proximityHitsStore.currentHits.length > 0}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyIcon}>👋</div>
            <p class={styles.emptyText}>No super close encounters yet</p>
            <p class={styles.emptySubtext}>Get near someone to see them here</p>
          </div>
        }
      >
        <div class={superCloseStyles.historyList}>
          <For each={proximityHitsStore.currentHits}>
            {(hit) => {
              const profile = getProfile(hit);
              
              return (
                <Show when={profile}>
                  {(p) => {
                    const actions = useProfileActions(p().id);
                    
                    return (
                      <div class={superCloseStyles.historyCard}>
                        <div class={superCloseStyles.cardHeader}>
                          <img
                            src={p().img}
                            class={superCloseStyles.avatar}
                            alt={p().name}
                          />
                          <div class={superCloseStyles.info}>
                            <span class={superCloseStyles.name}>{p().name}</span>
                            <span class={superCloseStyles.time}>{formatTime(hit.timestamp)}</span>
                          </div>
                          <button
                            class={superCloseStyles.waveBtn}
                            onClick={() => handleWaveAndPassBy(p())}
                          >
                            Wave & Pass By
                          </button>
                        </div>

                        <div class={superCloseStyles.actionsSection}>
                          <p class={superCloseStyles.actionsLabel}>say something to them</p>
                          <div class={superCloseStyles.actionsGrid}>
                            <button
                              class={`${superCloseStyles.actionBtn} ${actions.canAffordPulse() ? '' : superCloseStyles.disabled}`}
                              onClick={actions.handlePulse}
                              disabled={!actions.canAffordPulse()}
                            >
                              <span class={superCloseStyles.emoji}>❤️</span>
                              <span class={superCloseStyles.actionName}>Pulse</span>
                              <span class={superCloseStyles.cost}>$0.10</span>
                            </button>

                            <button
                              class={`${superCloseStyles.actionBtn} ${actions.canAffordReveal() ? '' : superCloseStyles.disabled}`}
                              onClick={actions.handleReveal}
                              disabled={!actions.canAffordReveal()}
                            >
                              <span class={superCloseStyles.emoji}>📸</span>
                              <span class={superCloseStyles.actionName}>Reveal</span>
                              <span class={superCloseStyles.cost}>$5.00</span>
                            </button>

                            <button
                              class={superCloseStyles.actionBtn}
                              onClick={actions.handleSlap}
                            >
                              <span class={superCloseStyles.emoji}>👋</span>
                              <span class={superCloseStyles.actionName}>Slap</span>
                              <span class={superCloseStyles.cost}>$10.00</span>
                            </button>

                            <button
                              class={`${superCloseStyles.actionBtn} ${p().isFollowing ? superCloseStyles.following : ''}`}
                              onClick={actions.handleFollow}
                            >
                              <span class={superCloseStyles.emoji}>⭐</span>
                              <span class={superCloseStyles.actionName}>
                                {p().isFollowing ? 'Following' : 'Follow'}
                              </span>
                              <span class={superCloseStyles.cost}>Free</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Show>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
