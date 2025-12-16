import { createMemo } from 'solid-js';
import { store as proximityStore } from '../../proximity/store/proximityStore';
import { profiles } from '../../proximity/mockData';

export const followingActions = {
  // Get all followed profiles
  getFollowingProfiles() {
    return proximityStore.profiles
      .filter(p => p.isFollowing)
      .map(storeProfile => {
        const mockProfile = profiles.find(p => p.id === storeProfile.id);
        return { ...mockProfile, ...storeProfile };
      });
  },

  // Get following count
  getFollowingCount() {
    return proximityStore.profiles.filter(p => p.isFollowing).length;
  }
};
