import { createSignal, createMemo } from "solid-js";
import { store } from "../../../store/proximityStore";

/**
 * Hook to manage selected profile state
 * Automatically syncs with store for balance/following status
 */
export function useProfileSelection(initialProfile) {
  const [selectedProfile, setSelectedProfile] = createSignal(initialProfile);
  
  // Reactive: Get profile with updated store data (balance, isFollowing, etc)
  const profileWithStoreData = createMemo(() => {
    const selected = selectedProfile();
    if (!selected) return null;
    
    const storeProfile = store.profiles.find(p => p.id === selected.id);
    return storeProfile || selected;
  });
  
  const selectProfile = (profile) => {
    setSelectedProfile(profile);
  };
  
  const selectProfileById = (profileId, allProfiles) => {
    const profile = allProfiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };
  
  return {
    selectedProfile,
    profileWithStoreData,
    selectProfile,
    selectProfileById
  };
}
