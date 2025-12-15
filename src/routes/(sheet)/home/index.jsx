import { Show, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { selectedProfile } from "../../../features/proximity/store/selectedProfileStore";
import { store as proximityStore } from "../../../features/proximity/store/proximityStore";
import { SelectedProfileCard } from "./SelectedProfileCard";
import { ProfileActions } from "./ProfileActions";
import { BlurredBackground } from "../../../features/proximity/components/BlurredBackground";
import styles from './home.module.css';

export default function Home() {
  const navigate = useNavigate();
  
  const profile = createMemo(() => {
    const selected = selectedProfile();
    const storeProfile = proximityStore.profiles.find(p => p.id === selected?.id);
    return storeProfile ? { ...selected, ...storeProfile } : selected;
  });

  return (
    <Show when={profile()}>
      {(p) => (
        <div class={styles.homeContent}>
          <button 
            class={styles.messagesBtn}
            onClick={() => navigate('/home/messages')}
          >
            <span class={styles.messageIcon}>💬</span>
          </button>

          <div class={styles.backgroundContainer}>
            <BlurredBackground src={p().img} blurAmount={20} scale={1.2} />
          </div>
          <SelectedProfileCard profile={p()} />
          <ProfileActions profile={p()} />
        </div>
      )}
    </Show>
  );
}
