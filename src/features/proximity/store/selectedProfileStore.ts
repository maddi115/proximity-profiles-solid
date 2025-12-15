import { createSignal, Accessor, Setter } from "solid-js";
import { profiles } from "../mockData";
import { Profile } from "../../../types/profile";

const [selectedProfile, setSelectedProfile] = createSignal<Profile | null>(profiles[0] || null);

export const selectedProfileActions = {
  selectProfile(profile: Profile | null): void {
    setSelectedProfile(profile);
    console.log('🎯 Selected profile:', profile?.id);
  },

  selectProfileById(profileId: number): void {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  }
};

export { selectedProfile, setSelectedProfile };
