import { createStore } from "solid-js/store";
import { Profile } from "../../../types/profile";

interface ProximityProfile extends Profile {
  balance: number;
  lastReaction?: string;
}

interface ProximityStore {
  profiles: ProximityProfile[];
  balance: number;
}

const [store, setStore] = createStore<ProximityStore>({
  profiles: [],
  balance: 100.00,
});

export const proximityActions = {
  sendAction(profileId: number, cost: number, reaction: string): boolean {
    if (cost > 0 && store.balance < cost) return false;
    
    setStore("balance", (prev) => prev - cost);
    setStore("profiles", (profile) => profile.id === profileId, {
      lastReaction: reaction,
      balance: (prev) => Number(prev || 0) + cost,
    });
    
    return true;
  },

  toggleFollow(profileId: number): void {
    setStore("profiles", (profile) => profile.id === profileId, "isFollowing", (prev) => !prev);
  },

  initializeProfiles(profiles: Profile[]): void {
    setStore("profiles", profiles.map(p => ({ ...p, balance: 0 })));
  },
};

export { store };
