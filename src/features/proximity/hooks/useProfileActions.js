import { createSignal, onCleanup } from "solid-js";
import { proximityActions, store } from "../../../store/proximityStore.js";
import { createHeart } from "../utils";

/**
 * Custom hook for profile interaction actions
 * Manages pulse, reveal, slap, and follow actions with cooldowns
 * @param {string} profileId - ID of the profile to interact with
 * @returns {Object} Action handlers and state
 */
export function useProfileActions(profileId) {
  const [pulseCount, setPulseCount] = createSignal(0);
  const [revealCount, setRevealCount] = createSignal(0);
  const [slapCount, setSlapCount] = createSignal(0);

  let cooldownTimer;

  onCleanup(() => {
    if (cooldownTimer) clearTimeout(cooldownTimer);
  });

  /**
   * Send a pulse action (costs $1)
   * @param {MouseEvent} e - Click event
   */
  const handlePulse = (e) => {
    const success = proximityActions.sendAction(profileId, 1, "pulse");
    if (success) {
      setPulseCount((prev) => prev + 1);
      const rect = e.target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createHeart(x, y);
    }
  };

  /**
   * Send a reveal action (costs $5)
   * @param {MouseEvent} e - Click event
   */
  const handleReveal = (e) => {
    const success = proximityActions.sendAction(profileId, 5, "reveal");
    if (success) {
      setRevealCount((prev) => prev + 1);
    }
  };

  /**
   * Send a slap action (free)
   * @param {MouseEvent} e - Click event
   */
  const handleSlap = (e) => {
    proximityActions.sendAction(profileId, 0, "slap");
    setSlapCount((prev) => prev + 1);
  };

  /**
   * Toggle follow status
   * @param {MouseEvent} e - Click event
   */
  const handleFollow = (e) => {
    proximityActions.toggleFollow(profileId);
  };

  return {
    handlePulse,
    handleReveal,
    handleSlap,
    handleFollow,
    pulseCount,
    revealCount,
    slapCount,
  };
}
