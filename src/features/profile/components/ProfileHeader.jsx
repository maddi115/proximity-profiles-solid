import { Show, createSignal } from "solid-js";
import { profileStore, profileActions } from "../store/profileStore";
import styles from "./profile.module.css";

/**
 * ProfileHeader - Avatar, name, bio with edit mode
 */
export function ProfileHeader() {
  const [editName, setEditName] = createSignal(profileStore.user.name);
  const [editBio, setEditBio] = createSignal(profileStore.user.bio);
  
  const handleSave = () => {
    profileActions.updateName(editName());
    profileActions.updateBio(editBio());
    profileActions.setEditing(false);
  };
  
  const handleCancel = () => {
    setEditName(profileStore.user.name);
    setEditBio(profileStore.user.bio);
    profileActions.setEditing(false);
  };
  
  return (
    <div class={styles.profileHeader}>
      <div class={styles.avatarSection}>
        <img 
          src={profileStore.user.avatar} 
          alt={profileStore.user.name}
          class={styles.avatar}
        />
        <Show when={profileStore.isEditing}>
          <button class={styles.avatarEditBtn}>
            📷 Change
          </button>
        </Show>
      </div>
      
      <div class={styles.profileInfo}>
        <Show 
          when={!profileStore.isEditing}
          fallback={
            <div class={styles.editForm}>
              <input
                type="text"
                value={editName()}
                onInput={(e) => setEditName(e.target.value)}
                class={styles.editInput}
                placeholder="Your name"
              />
              <textarea
                value={editBio()}
                onInput={(e) => setEditBio(e.target.value)}
                class={styles.editTextarea}
                placeholder="Your bio"
                rows="3"
              />
              <div class={styles.editActions}>
                <button class={styles.btnSave} onClick={handleSave}>
                  ✓ Save
                </button>
                <button class={styles.btnCancel} onClick={handleCancel}>
                  ✕ Cancel
                </button>
              </div>
            </div>
          }
        >
          <h1 class={styles.profileName}>{profileStore.user.name}</h1>
          <p class={styles.profileUsername}>@{profileStore.user.username}</p>
          <p class={styles.profileBio}>{profileStore.user.bio}</p>
        </Show>
      </div>
    </div>
  );
}
