import { Show, createMemo } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { selectedProfile } from "../../../features/proximity/store/selectedProfileStore";
import { store as proximityStore } from "../../../features/proximity/store/proximityStore";
import { SelectedProfileCard } from "./SelectedProfileCard";
import { ProfileActions } from "./ProfileActions";
import { DynamicIsland } from "./DynamicIsland";
import styles from './home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isOnMessagesPage = () => location.pathname.includes('/messages');
  const isOnFollowingPage = () => location.pathname.includes('/following');
  
  const profile = createMemo(() => {
    const selected = selectedProfile();
    const storeProfile = proximityStore.profiles.find(p => p.id === selected?.id);
    return storeProfile ? { ...selected, ...storeProfile } : selected;
  });

  return (
    <Show when={profile()}>
      {(p) => (
        <div class={styles.homeContent}>
          <div class={styles.topRow}>
            <SelectedProfileCard profile={p()} />
            <DynamicIsland />
          </div>

          <div class={styles.navContainer}>
            <div class={styles.buttonGroup}>
              <button 
                class={styles.navBtn}
                onClick={() => navigate('/home/following')}
              >
                Followings
              </button>
              <button 
                class={styles.navBtn}
                onClick={() => navigate('/home/messages')}
              >
                Messages
              </button>
            </div>
          </div>

          <ProfileActions profile={p()} />
        </div>
      )}
    </Show>
  );
}
