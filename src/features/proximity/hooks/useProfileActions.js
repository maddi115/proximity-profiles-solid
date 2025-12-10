import { createSignal, onCleanup } from "solid-js";
import { proximityActions, store } from "../store/proximityStore";
import { useNotifications } from "../../notifications/hooks/useNotifications";
import { useLoading } from "../../loading/hooks/useLoading";
import { handleError, AppError, ErrorCodes } from "../../errors";
import { activityActions } from "../../notifications/store/activityStore";
import { profiles } from "../mockData";
import { createHeart } from "../utils";

/**
 * Profile actions with proper cleanup (NO SPAM)
 */
export function useProfileActions(profileId) {
  const [hearts, setHearts] = createSignal([]);
  const { showNotification } = useNotifications();
  const { isLoading, withLoading } = useLoading();
  
  // Track timeouts for cleanup
  const heartTimeouts = new Set();
  
  const getProfile = () => {
    const storeProfile = store.profiles.find(p => p.id === profileId);
    if (storeProfile) return storeProfile;
    return profiles.find(p => p.id === profileId);
  };
  
  const canAfford = (cost) => store.balance >= cost;

  const handlePulse = async (e) => {
    const key = `pulse-${profileId}`;
    
    try {
      await withLoading(key, async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const success = proximityActions.sendAction(profileId, 1, "pulse");
        
        if (!success) {
          throw new AppError(ErrorCodes.INSUFFICIENT_BALANCE);
        }
        
        const profile = getProfile();
        
        activityActions.addActivity({
          type: 'pulse',
          emoji: '❤️',
          action: `Pulse sent to ${profile?.name || 'user'}`,
          targetProfile: { id: profileId },
          cost: 1
        });
        
        showNotification({
          type: 'success',
          message: `Pulse sent to ${profile?.name || 'user'}`,
          icon: '❤️',
          duration: 3000,
          profile: profile ? {
            name: profile.name,
            image: profile.img
          } : undefined
        });
        
        const heart = createHeart(e.clientX, e.clientY);
        setHearts([...hearts(), heart]);
        
        const timeout = setTimeout(() => {
          setHearts(hearts().filter(h => h !== heart));
          heartTimeouts.delete(timeout);
        }, 2000);
        
        heartTimeouts.add(timeout);
      });
    } catch (error) {
      handleError(error, { 
        context: 'pulse-action',
        showNotification: true 
      });
    }
  };

  const handleReveal = async (e) => {
    const key = `reveal-${profileId}`;
    
    try {
      await withLoading(key, async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const success = proximityActions.sendAction(profileId, 5, "reveal");
        
        if (!success) {
          throw new AppError(ErrorCodes.INSUFFICIENT_BALANCE);
        }
        
        const profile = getProfile();
        
        activityActions.addActivity({
          type: 'reveal',
          emoji: '📸',
          action: `Reveal sent to ${profile?.name || 'user'}`,
          targetProfile: { id: profileId },
          cost: 5
        });
        
        showNotification({
          type: 'success',
          message: `Reveal sent to ${profile?.name || 'user'}`,
          icon: '📸',
          duration: 3000,
          profile: profile ? {
            name: profile.name,
            image: profile.img
          } : undefined
        });
      });
    } catch (error) {
      handleError(error, { 
        context: 'reveal-action',
        showNotification: true 
      });
    }
  };

  const handleSlap = async (e) => {
    const key = `slap-${profileId}`;
    
    try {
      await withLoading(key, async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        proximityActions.sendAction(profileId, 0, "slap");
        const profile = getProfile();
        
        activityActions.addActivity({
          type: 'slap',
          emoji: '👋',
          action: `Slap sent to ${profile?.name || 'user'}`,
          targetProfile: { id: profileId },
          cost: 0
        });
        
        showNotification({
          type: 'info',
          message: `Slap sent to ${profile?.name || 'user'}`,
          icon: '👋',
          duration: 3000,
          profile: profile ? {
            name: profile.name,
            image: profile.img
          } : undefined
        });
      });
    } catch (error) {
      handleError(error, { 
        context: 'slap-action',
        showNotification: true 
      });
    }
  };

  const handleFollow = async (e) => {
    const key = `follow-${profileId}`;
    
    try {
      await withLoading(key, async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        proximityActions.toggleFollow(profileId);
        const profile = getProfile();
        const isFollowing = store.profiles.find(p => p.id === profileId)?.isFollowing;
        
        activityActions.addActivity({
          type: isFollowing ? 'follow' : 'unfollow',
          emoji: isFollowing ? '⭐' : '➖',
          action: isFollowing ? `Following ${profile?.name || 'user'}` : `Unfollowed ${profile?.name || 'user'}`,
          targetProfile: { id: profileId },
          cost: 0
        });
        
        showNotification({
          type: 'success',
          message: isFollowing ? `Following ${profile?.name || 'user'}` : `Unfollowed ${profile?.name || 'user'}`,
          icon: isFollowing ? '⭐' : '➖',
          duration: 2000,
          profile: profile ? {
            name: profile.name,
            image: profile.img
          } : undefined
        });
      });
    } catch (error) {
      handleError(error, { 
        context: 'follow-action',
        showNotification: true 
      });
    }
  };

  // Cleanup (silent - no spam)
  onCleanup(() => {
    heartTimeouts.forEach(timeout => clearTimeout(timeout));
    heartTimeouts.clear();
    setHearts([]);
  });

  return {
    handlePulse,
    handleReveal,
    handleSlap,
    handleFollow,
    hearts,
    balance: () => store.balance,
    isPulsing: () => isLoading(`pulse-${profileId}`),
    isRevealing: () => isLoading(`reveal-${profileId}`),
    isSlapping: () => isLoading(`slap-${profileId}`),
    isFollowing: () => isLoading(`follow-${profileId}`),
    canAffordPulse: () => canAfford(1),
    canAffordReveal: () => canAfford(5)
  };
}
