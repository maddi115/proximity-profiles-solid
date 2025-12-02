import { createSignal, Show, onCleanup } from "solid-js";
import { createHeart } from "../utils";
import styles from "../proximity.module.css"; // <-- NEW CSS MODULE IMPORT

// Helper to conditionally join CSS Module classes
const classNames = (...classes) => classes.filter(Boolean).join(' ');

export function ProfileMarker(props) {
  // State
  const [savedReaction, setSavedReaction] = createSignal("");
  const [teaseAmount, setTeaseAmount] = createSignal(1.0);
  const [showAmount, setShowAmount] = createSignal(false);
  const [isHolding, setIsHolding] = createSignal(false);
  const [isFollowing, setIsFollowing] = createSignal(false);
  const [showActionForm, setShowActionForm] = createSignal(false);
  const [actionLink, setActionLink] = createSignal("");
  const [isHovering, setIsHovering] = createSignal(false);
  const [imageExpanded, setImageExpanded] = createSignal(false);

  // Refs
  let sentMsgRef;

  // Timers / flags
  let intervalId;
  let timeoutId;
  let holding = false;
  let activated = false;

  // Cleanup timers to prevent leaks
  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
  });

  // ==================== HANDLERS ====================

  const handlePulse = (e) => {
    e.stopPropagation();
    setSavedReaction("❤️");

    const target = sentMsgRef || e.target;
    if (target) {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(centerX, centerY), i * 100);
      }
    }
  };

  const handleReveal = (e) => {
    e.stopPropagation();
    setSavedReaction("📸");
  };

  const handleSlap = (e) => {
    e.stopPropagation();
    setSavedReaction("👋");
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing());
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActionForm(!showActionForm());
  };

  const handleActionSubmit = (e) => {
    e.stopPropagation();
    if (actionLink().trim()) {
      setSavedReaction("💭");
      setShowActionForm(false);
      setActionLink("");
    }
  };

  const handleActionCancel = (e) => {
    e.stopPropagation();
    setShowActionForm(false);
    setActionLink("");
  };

  // ==================== TEASE BUTTON LOGIC ====================

  const startTease = (e) => {
    e.stopPropagation();
    if (e.type === "touchstart") e.preventDefault();

    holding = true;
    activated = false;

    timeoutId = setTimeout(() => {
      if (!holding) return;
      activated = true;
      setTeaseAmount(1.0);
      setIsHolding(true);
      setShowAmount(true);
      intervalId = setInterval(() => {
        setTeaseAmount((prev) => prev + 0.01);
      }, 100);
    }, 500);
  };

  const stopTease = (e) => {
    e.stopPropagation();
    if (!holding) return;

    holding = false;
    if (timeoutId) clearTimeout(timeoutId);

    if (!activated) return;
    if (intervalId) clearInterval(intervalId);

    setIsHolding(false);
    setSavedReaction("😏");
    setTimeout(() => setShowAmount(false), 500);
  };

  // ==================== HOVER HANDLERS ====================

  const handleMouseEnterMarker = () => {
    setIsHovering(true);
    setTimeout(() => setImageExpanded(true), 250);
  };

  const handleMouseLeaveMarker = () => {
    setIsHovering(false);
    setImageExpanded(false);
  };

  // ==================== RENDER ====================

  return (
    <div
      class={styles.marker}
      style={{ top: props.profile.top, left: props.profile.left }}
      onMouseEnter={handleMouseEnterMarker}
      onMouseLeave={handleMouseLeaveMarker}
    >
      <img src={props.profile.img} class={styles["marker-img"]} loading="lazy" />

      <Show when={props.profile.balance >= 100}>
        <div class={styles["balance-badge"]}>
          <span class={styles["balance-heart"]}>🤍</span>
          <span class={styles["balance-amount"]}>${props.profile.balance}</span>
        </div>
      </Show>

      <Show when={isFollowing() && isHovering()}>
        <div class={styles["following-badge"]}>⭐</div>
      </Show>

      <Show when={savedReaction() && isHovering() && imageExpanded()}>
        <div class={styles["sent-msg"]} ref={sentMsgRef}>
          {savedReaction()}
        </div>
      </Show>

      <Show when={showAmount()}>
        <div class={styles["tease-amount"]}>${teaseAmount().toFixed(2)}</div>
      </Show>

      <div class={styles["pulse-action"]}>
        {/* Pulse Button */}
        <button class={styles.btn} onClick={handlePulse}>
          <span>pulse $</span>
          <span class={styles["btn-emoji"]}>❤️</span>
        </button>

        {/* Reveal Button */}
        <button class={styles.btn} onClick={handleReveal}>
          <span>reveal request pic</span>
          <span class={styles["btn-emoji"]}>📸</span>
        </button>

        {/* Slap Button */}
        <button class={styles.btn} onClick={handleSlap}>
          <span>slap</span>
          <span class={styles["btn-emoji"]}>👋</span>
        </button>

        {/* Follow Button */}
        <button
          class={classNames(styles.btn, isFollowing() && styles.following)}
          onClick={handleFollow}
        >
          <span>{isFollowing() ? "following" : "follow"}</span>
          <span class={styles["btn-emoji"]}>{isFollowing() ? "✓" : "+"}</span>
        </button>

        {/* Action Form Button */}
        <div class={styles["action-button-wrapper"]}>
          <button
            class={classNames(styles.btn, showActionForm() && styles.active)}
            onClick={handleActionClick}
          >
            <span>what do you want to do to her</span>
            <span class={styles["btn-emoji"]}>💭</span>
          </button>

          <Show when={showActionForm()}>
            <div classs={styles["action-form"]}>
              <input
                type="text"
                class={styles["action-input"]}
                placeholder="Paste image/video link..."
                value={actionLink()}
                onInput={(e) => setActionLink(e.currentTarget.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div class={styles["action-form-buttons"]}>
                <button class={styles["action-submit"]} onClick={handleActionSubmit}>
                  Send $9.00
                </button>
                <button class={styles["action-cancel"]} onClick={handleActionCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </Show>
        </div>

        {/* Tease Button */}
        <button
          class={classNames(styles.btn, styles["tease-btn"], isHolding() && styles.holding)}
          onMouseDown={startTease}
          onMouseUp={stopTease}
          onMouseLeave={stopTease}
          onTouchStart={startTease}
          onTouchEnd={stopTease}
        >
          <span>tease</span>
          <span class={styles["btn-emoji"]}>😏</span>
          <div class={styles["tease-hint"]}>hold button to tease</div>
        </button>
      </div>
    </div>
  );
}
