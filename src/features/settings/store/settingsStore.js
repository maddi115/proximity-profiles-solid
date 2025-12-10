import { createStore } from "solid-js/store";

/**
 * Settings Store - User preferences
 */

const [store, setStore] = createStore({
  theme: 'dark', // 'dark' or 'light'
  notifications: {
    pulse: true,
    reveal: true,
    slap: true,
    follow: true,
    sound: true
  },
  privacy: {
    showLocation: true,
    allowPulses: true,
    allowReveals: true
  },
  account: {
    email: "user@proximity.app",
    emailVerified: true
  }
});

export const settingsActions = {
  setTheme(theme) {
    setStore("theme", theme);
    console.log(`🎨 Theme changed to: ${theme}`);
  },
  
  toggleNotification(type) {
    setStore("notifications", type, (val) => !val);
  },
  
  togglePrivacy(setting) {
    setStore("privacy", setting, (val) => !val);
  },
  
  updateEmail(email) {
    setStore("account", "email", email);
  }
};

export { store as settingsStore };
