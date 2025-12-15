import { createSignal, onCleanup, Accessor } from "solid-js";
import { proximityActions, store } from "../store/proximityStore";
import { useNotifications } from "../../notifications/hooks/useNotifications";
import { useLoading } from "../../loading/hooks/useLoading";
import { handleError } from "../../errors";
import { activityActions } from "../../notifications/store/activityStore";
import { profiles } from "../mockData";
import { createHeart } from "../utils";

interface ProfileActionsReturn {
  handlePulse: (e?: Event) => Promise<void>;
  handleReveal: (e?: Event) => Promise<void>;
  handleSlap: (e?: Event) => Promise<void>;
  handleFollow: (e?: Event) => Promise<void>;
  isPulsing: Accessor<boolean>;
  isRevealing: Accessor<boolean>;
  isSlapping: Accessor<boolean>;
  isFollowing: Accessor<boolean>;
  canAffordPulse: () => boolean;
  canAffordReveal: () => boolean;
  hearts: Accessor<any[]>;
}

export function useProfileActions(profileId: number): ProfileActionsReturn {
  const [hearts, setHearts] = createSignal<any[]>([]);
  const [isPulsing, setIsPulsing] = createSignal(false);
  const [isRevealing, setIsRevealing] = createSignal(false);
  const [isSlapping, setIsSlapping] = createSignal(false);
  const [isFollowing, setIsFollowing] = createSignal(false);
  
  const { showNotification } = useNotifications();
  const { withLoading } = useLoading();

  const getProfile = (id: number) => {
    return store.profiles.find(p => p.id === id) || 
           profiles.find(p => p.id === id);
  };

  const canAffordPulse = (): boolean => {
    return true;
  };

  const canAffordReveal = (): boolean => {
    return true;
  };

  const handlePulse = async (e?: Event) => {
    if (e) e.preventDefault();
    if (!profileId) {
      console.error('No profileId provided for pulse action');
      return;
    }

    setIsPulsing(true);
    try {
      await withLoading('pulse', async () => {
        const profile = getProfile(profileId);
        
        activityActions.addActivity({
          type: 'pulse',
          emoji: '❤️',
          action: 'Pulsed',
          profileId: profileId.toString(),
          cost: 1
        });

        showNotification({
          type: 'success',
          message: `Pulsed ${profile?.name || 'profile'}!`,
          duration: 2000,
          icon: '❤️',
          profile: profile ? {
            image: profile.img,
            name: profile.name
          } : null
        });

        const newHeart = createHeart();
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h !== newHeart));
        }, 2000);
      });
    } catch (error) {
      handleError(error, { action: 'pulse' });
    } finally {
      setIsPulsing(false);
    }
  };

  const handleReveal = async (e?: Event) => {
    if (e) e.preventDefault();
    if (!profileId) {
      console.error('No profileId provided for reveal action');
      return;
    }

    setIsRevealing(true);
    try {
      await withLoading('reveal', async () => {
        const profile = getProfile(profileId);
        
        activityActions.addActivity({
          type: 'reveal',
          emoji: '📸',
          action: 'Revealed',
          profileId: profileId.toString(),
          cost: 5
        });

        showNotification({
          type: 'success',
          message: `Revealed ${profile?.name || 'profile'}!`,
          duration: 2000,
          icon: '📸',
          profile: profile ? {
            image: profile.img,
            name: profile.name
          } : null
        });
      });
    } catch (error) {
      handleError(error, { action: 'reveal' });
    } finally {
      setIsRevealing(false);
    }
  };

  const handleSlap = async (e?: Event) => {
    if (e) e.preventDefault();
    if (!profileId) {
      console.error('No profileId provided for slap action');
      return;
    }

    setIsSlapping(true);
    try {
      await withLoading('slap', async () => {
        const profile = getProfile(profileId);
        
        activityActions.addActivity({
          type: 'slap',
          emoji: '👋',
          action: 'Slapped',
          profileId: profileId.toString(),
          cost: 0
        });

        showNotification({
          type: 'success',
          message: `Slapped ${profile?.name || 'profile'}!`,
          duration: 2000,
          icon: '👋',
          profile: profile ? {
            image: profile.img,
            name: profile.name
          } : null
        });
      });
    } catch (error) {
      handleError(error, { action: 'slap' });
    } finally {
      setIsSlapping(false);
    }
  };

  const handleFollow = async (e?: Event) => {
    if (e) e.preventDefault();
    if (!profileId) {
      console.error('No profileId provided for follow action');
      return;
    }

    setIsFollowing(true);
    try {
      await withLoading('follow', async () => {
        const profile = getProfile(profileId);
        
        activityActions.addActivity({
          type: 'follow',
          emoji: '⭐',
          action: 'Followed',
          profileId: profileId.toString(),
          cost: 0
        });

        proximityActions.toggleFollow(profileId);

        showNotification({
          type: 'success',
          message: `Followed ${profile?.name || 'profile'}!`,
          duration: 2000,
          icon: '⭐',
          profile: profile ? {
            image: profile.img,
            name: profile.name
          } : null
        });
      });
    } catch (error) {
      handleError(error, { action: 'follow' });
    } finally {
      setIsFollowing(false);
    }
  };

  onCleanup(() => {
    setHearts([]);
    setIsPulsing(false);
    setIsRevealing(false);
    setIsSlapping(false);
    setIsFollowing(false);
  });

  return {
    handlePulse,
    handleReveal,
    handleSlap,
    handleFollow,
    isPulsing,
    isRevealing,
    isSlapping,
    isFollowing,
    canAffordPulse,
    canAffordReveal,
    hearts
  };
}
