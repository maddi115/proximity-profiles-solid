import { createSignal } from "solid-js";
import { profiles } from "../mockData";

// Use createSignal instead of createStore for simpler reactivity
const [selectedProfile, setSelectedProfile] = createSignal(profiles[0]);

export const selectedProfileActions = {
  selectProfile(profile) {
    setSelectedProfile(profile);
    console.log('🎯 Selected profile:', profile.id);
  },

  selectProfileById(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  }
};

// Export the signal directly
export { selectedProfile, setSelectedProfile };
