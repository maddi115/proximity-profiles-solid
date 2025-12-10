import { createStore } from "solid-js/store";

/**
 * Profile Store - User profile data
 */

const [store, setStore] = createStore({
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
  updateProfile(updates) {
    setStore("user", updates);
    console.log("✅ Profile updated");
  },
  
  updateAvatar(avatarUrl) {
    setStore("user", "avatar", avatarUrl);
  },
  
  updateBio(bio) {
    setStore("user", "bio", bio);
  },
  
  updateName(name) {
    setStore("user", "name", name);
  },
  
  incrementStat(statName) {
    setStore("user", "stats", statName, (val) => val + 1);
  },
  
  setEditing(isEditing) {
    setStore("isEditing", isEditing);
  }
};

export { store as profileStore };
