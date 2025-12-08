import { createSignal, onCleanup } from "solid-js";
import { proximityActions, store } from "../store/proximityStore";
import { createHeart } from "../utils";

/**
 * Hook for profile interaction actions
 */
export function useProfileActions(profileId) {
  const [hearts, setHearts] = createSignal([]);

  const handlePulse = (e) => {
    const success = proximityActions.sendAction(profileId, 1, "pulse");
    if (success) {
      const heart = createHeart(e.clientX, e.clientY);
      setHearts([...hearts(), heart]);
      setTimeout(() => {
        setHearts(hearts().filter(h => h !== heart));
      }, 2000);
    }
  };

  const handleReveal = (e) => {
    proximityActions.sendAction(profileId, 5, "reveal");
  };

  const handleSlap = (e) => {
    proximityActions.sendAction(profileId, 0, "slap");
  };

  const handleFollow = (e) => {
    proximityActions.toggleFollow(profileId);
  };

  onCleanup(() => {
    setHearts([]);
  });

  return {
    handlePulse,
    handleReveal,
    handleSlap,
    handleFollow,
    hearts,
    balance: () => store.balance,
  };
}
