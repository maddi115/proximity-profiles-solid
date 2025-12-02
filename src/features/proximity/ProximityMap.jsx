import { For, ErrorBoundary } from "solid-js";
import { profiles } from "./data";
import { ProfileMarker } from "./components/ProfileMarker";
import styles from "./proximity.module.css"; // <-- NEW CSS MODULE IMPORT

export function ProximityMap() {
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
              return null; // or a simple placeholder marker
            }}
          >
            <ProfileMarker profile={profile} />
          </ErrorBoundary>
        )}
      </For>
    </div>
  );
}
