import { createSignal, createMemo, Accessor } from "solid-js";
import { store } from "../store/proximityStore";
import { Profile } from "../../../types/profile";

interface UseProfileSelectionReturn {
  selectedProfile: Accessor<Profile | null>;
  profileWithStoreData: Accessor<Profile | null>;
  selectProfile: (profile: Profile | null) => void;
  selectProfileById: (profileId: number, allProfiles: Profile[]) => void;
}

/**
 * Hook to manage selected profile state
 * Automatically syncs with store for balance/following status
 */
export function useProfileSelection(initialProfile: Profile | null = null): UseProfileSelectionReturn {
  const [selectedProfile, setSelectedProfile] = createSignal<Profile | null>(initialProfile);

  // Reactive: Get profile with updated store data (balance, isFollowing, etc)
  const profileWithStoreData = createMemo<Profile | null>(() => {
    const selected = selectedProfile();
    if (!selected) return null;
    
    const storeProfile = store.profiles.find(p => p.id === selected.id);
    return storeProfile || selected;
  });

  const selectProfile = (profile: Profile | null): void => {
    setSelectedProfile(profile);
  };

  const selectProfileById = (profileId: number, allProfiles: Profile[]): void => {
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
