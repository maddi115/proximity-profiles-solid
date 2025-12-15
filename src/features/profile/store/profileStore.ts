import { createStore } from "solid-js/store";
import { UserProfile, UserProfileUpdate } from "../../../types/user";

interface ProfileStore {
  user: UserProfile;
  isEditing: boolean;
}

const [store, setStore] = createStore<ProfileStore>({
  user: {
    id: "0",
    username: "proximityuser",
    name: "Proximity User",
    bio: "Living in the moment, connecting with nearby souls ✨",
    avatar: "https://i.pravatar.cc/300?img=68",
    email: "user@proximity.app",
    balance: 100.00,
    stats: {
      pulsesSent: 0,
      revealsReceived: 0,
      slapsGiven: 0,
      following: 0,
      followers: 0
    },
    joinedDate: new Date("2024-01-15")
  },
  isEditing: false
});

export const profileActions = {
  updateProfile(updates: UserProfileUpdate): void {
    setStore("user", updates);
    console.log("✅ Profile updated");
  },

  updateAvatar(avatarUrl: string): void {
    setStore("user", "avatar", avatarUrl);
  },

  updateBio(bio: string): void {
    setStore("user", "bio", bio);
  },

  updateName(name: string): void {
    setStore("user", "name", name);
  },

  incrementStat(statName: keyof UserProfile['stats']): void {
    setStore("user", "stats", statName, (val) => val + 1);
  },

  setEditing(isEditing: boolean): void {
    setStore("isEditing", isEditing);
  }
};

export { store as profileStore };
