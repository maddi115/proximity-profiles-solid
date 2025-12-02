// src/features/proximity/components/ProfileMarker.jsx
import { Show, createSignal } from "solid-js";
import { store } from "../../../store/proximityStore.js";
import { useProfileActions } from "../useProfileActions"; 
import styles from "../proximity.module.css";

// Helper to conditionally join CSS Module classes
const classNames = (...classes) => classes.filter(Boolean).join(' ');

export function ProfileMarker(props) {
  const profileId = props.profile.id;
  
  // Get reactive profile data from store
  const profile = () => store.profiles.find(p => p.id === profileId) || props.profile;
  
  // --- Local UI State ---
  const [isHovering, setIsHovering] = createSignal(false);
  const [imageExpanded, setImageExpanded] = createSignal(false);

  // --- Custom Primitive Hook ---
  const actions = useProfileActions(profileId);

  // --- Local Handlers for Hover/Visuals ---
  const handleMouseEnterMarker = () => {
    setIsHovering(true);
    setTimeout(() => setImageExpanded(true), 250);
  };

  const handleMouseLeaveMarker = () => {
    setIsHovering(false);
    setImageExpanded(false);
    actions.stopTease({ stopPropagation: () => {} });
  };

  // --- RENDER ---

  return (
    <div ref={actions.setMarkerRef}
      class={styles.marker}
      style={{ top: profile().top, left: profile().left }}
      onMouseEnter={handleMouseEnterMarker}
      onMouseLeave={handleMouseLeaveMarker}
    >
      <img 
        src={profile().img} 
        class={styles["marker-img"]} 
        loading="lazy" 
      />

      {/* Balance Badge */}
      <Show when={profile().balance >= 100}>
        <div ref={actions.setMarkerRef} class={styles["balance-badge"]}>
          <span class={styles["balance-heart"]}>🤍</span>
          <span class={styles["balance-amount"]}>${profile().balance.toFixed(2)}</span>
        </div>
      </Show>

      {/* Following Badge */}
      <Show when={profile().isFollowing && isHovering()}>
        <div ref={actions.setMarkerRef} class={styles["following-badge"]}>⭐</div>
      </Show>

      {/* Sent Message/Reaction Display */}
      <Show when={profile().lastReaction && isHovering() && imageExpanded()}>
        <div ref={actions.setMarkerRef} class={styles["sent-msg"]}>
          {profile().lastReaction}
        </div>
      </Show>

      {/* Tease Amount Display */}
      <Show when={actions.showAmount()}>
        <div ref={actions.setMarkerRef} class={styles["tease-amount"]}>${actions.teaseAmount().toFixed(2)}</div>
      </Show>

      <div ref={actions.setMarkerRef} class={styles["pulse-action"]}>
        {/* Pulse Button */}
        <button class={styles.btn} onClick={actions.handlePulse}>
          <span>pulse $1.00</span>
          <span class={styles["btn-emoji"]}>❤️</span>
        </button>

        {/* Reveal Button */}
        <button class={styles.btn} onClick={actions.handleReveal}>
          <span>reveal request $5.00</span>
          <span class={styles["btn-emoji"]}>📸</span>
        </button>

        {/* Slap Button */}
        <button class={styles.btn} onClick={actions.handleSlap}>
          <span>slap (free)</span>
          <span class={styles["btn-emoji"]}>👋</span>
        </button>

        {/* Follow Button */}
        <button
          class={classNames(styles.btn, profile().isFollowing && styles.following)}
          onClick={actions.handleFollow}
        >
          <span>{profile().isFollowing ? "following" : "follow"}</span>
          <span class={styles["btn-emoji"]}>{profile().isFollowing ? "✓" : "+"}</span>
        </button>

        {/* Action Form Button */}
        <div ref={actions.setMarkerRef} class={styles["action-button-wrapper"]}>
          <button
            class={classNames(styles.btn, actions.showActionForm() && styles.active)}
            onClick={actions.handleActionClick}
          >
            <span>custom action $9.00</span>
            <span class={styles["btn-emoji"]}>💭</span>
          </button>

          <Show when={actions.showActionForm()}>
            <div ref={actions.setMarkerRef} class={styles["action-form"]}>
              <input
                type="text"
                class={styles["action-input"]}
                placeholder="Paste image/video link..."
                value={actions.actionLink()}
                onInput={(e) => actions.setActionLink(e.currentTarget.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div ref={actions.setMarkerRef} class={styles["action-form-buttons"]}>
                <button class={styles["action-submit"]} onClick={actions.handleActionSubmit}>
                  Send $9.00
                </button>
                <button class={styles["action-cancel"]} onClick={actions.handleActionCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </Show>
        </div>

        {/* Tease Button */}
        <button
          class={classNames(styles.btn, styles["tease-btn"], actions.isHolding() && styles.holding)}
          onMouseDown={actions.startTease}
          onMouseUp={actions.stopTease}
          onMouseLeave={actions.stopTease}
          onTouchStart={actions.startTease}
          onTouchEnd={actions.stopTease}
        >
          <span>tease: hold to pay</span>
          <span class={styles["btn-emoji"]}>😏</span>
          <div ref={actions.setMarkerRef} class={styles["tease-hint"]}>hold button to tease</div>
        </button>
      </div>
    </div>
  );
}
