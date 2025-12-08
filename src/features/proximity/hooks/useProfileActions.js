import { createSignal, onCleanup } from "solid-js";
import { proximityActions, store } from "../store/proximityStore";
import { useNotifications } from "../../notifications/hooks/useNotifications";
import { activityActions } from "../../notifications/store/activityStore";
import { profiles } from "../mockData";
import { createHeart } from "../utils";

/**
 * Hook for profile interaction actions
 * Logs all activities to history
 */
export function useProfileActions(profileId) {
  const [hearts, setHearts] = createSignal([]);
  const { showNotification } = useNotifications();
  
  // Get profile data
  const getProfile = () => {
    const storeProfile = store.profiles.find(p => p.id === profileId);
    if (storeProfile) return storeProfile;
    return profiles.find(p => p.id === profileId);
  };

  const handlePulse = (e) => {
    const success = proximityActions.sendAction(profileId, 1, "pulse");
    const profile = getProfile();
    
    if (success) {
      // Log activity
      activityActions.addActivity({
        type: 'pulse',
        emoji: '❤️',
        action: `Pulse sent to ${profile?.name || 'user'}`,
        targetProfile: {
          id: profileId,
          name: profile?.name,
          image: profile?.img
        },
        cost: 1
      });
      
      // Show notification
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
      
      // Heart animation
      const heart = createHeart(e.clientX, e.clientY);
      setHearts([...hearts(), heart]);
      setTimeout(() => {
        setHearts(hearts().filter(h => h !== heart));
      }, 2000);
    } else {
      showNotification({
        type: 'error',
        message: 'Insufficient balance',
        icon: '⚠️',
        duration: 3000
      });
    }
  };

  const handleReveal = (e) => {
    const success = proximityActions.sendAction(profileId, 5, "reveal");
    const profile = getProfile();
    
    if (success) {
      // Log activity
      activityActions.addActivity({
        type: 'reveal',
        emoji: '📸',
        action: `Reveal sent to ${profile?.name || 'user'}`,
        targetProfile: {
          id: profileId,
          name: profile?.name,
          image: profile?.img
        },
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
    } else {
      showNotification({
        type: 'error',
        message: 'Insufficient balance',
        icon: '⚠️',
        duration: 3000
      });
    }
  };

  const handleSlap = (e) => {
    proximityActions.sendAction(profileId, 0, "slap");
    const profile = getProfile();
    
    // Log activity
    activityActions.addActivity({
      type: 'slap',
      emoji: '👋',
      action: `Slap sent to ${profile?.name || 'user'}`,
      targetProfile: {
        id: profileId,
        name: profile?.name,
        image: profile?.img
      },
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
  };

  const handleFollow = (e) => {
    proximityActions.toggleFollow(profileId);
    const profile = getProfile();
    const isFollowing = store.profiles.find(p => p.id === profileId)?.isFollowing;
    
    // Log activity
    activityActions.addActivity({
      type: isFollowing ? 'follow' : 'unfollow',
      emoji: isFollowing ? '⭐' : '➖',
      action: isFollowing ? `Following ${profile?.name || 'user'}` : `Unfollowed ${profile?.name || 'user'}`,
      targetProfile: {
        id: profileId,
        name: profile?.name,
        image: profile?.img
      },
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
