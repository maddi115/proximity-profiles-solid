import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  profiles: [],
  balance: 100.00,
});

export const proximityActions = {
  sendAction(profileId, cost, reaction) {
    if (cost > 0 && store.balance < cost) {
      console.warn("Insufficient balance");
      return false;
    }
    
    setStore("balance", (prev) => prev - cost);
    setStore("profiles", (profile) => profile.id === profileId, {
      lastReaction: reaction,
      balance: (prev) => (prev || 0) + cost,
    });
    
    return true;
  },

  toggleFollow(profileId) {
    setStore("profiles", (profile) => profile.id === profileId, "isFollowing", (prev) => !prev);
  },

  initializeProfiles(profiles) {
    setStore("profiles", profiles);
  },
};

export { store };
