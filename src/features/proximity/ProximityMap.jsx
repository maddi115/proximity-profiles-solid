import { For, ErrorBoundary, onMount } from "solid-js";
import { profiles } from "./data";
import { ProfileMarker } from "./components/ProfileMarker";
import { proximityActions } from "../../store/proximityStore";
import styles from "./proximity.module.css";

export function ProximityMap() {
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });

  return (
    <div>
      <div class={styles["proximity-circle"]}></div>
      <div class={styles["proximity-label"]}>
        people live online within 50ft radius of you
      </div>
      <For each={profiles}>
        {(profile) => (
          <ErrorBoundary
            fallback={(err) => {
              console.error("Marker crashed:", err);
              return null;
            }}
          >
            <ProfileMarker profile={profile} />
          </ErrorBoundary>
        )}
      </For>
    </div>
  );
}
