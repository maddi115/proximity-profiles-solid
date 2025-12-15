import { createStore } from "solid-js/store";
import { Theme, NotificationSettings, PrivacySettings, AccountSettings } from "../../../types/settings";

interface SettingsStore {
  theme: Theme;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  account: AccountSettings;
}

const [store, setStore] = createStore<SettingsStore>({
  theme: 'dark',
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
  setTheme(theme: Theme): void {
    setStore("theme", theme);
    console.log(`🎨 Theme changed to: ${theme}`);
  },

  toggleNotification(type: keyof NotificationSettings): void {
    setStore("notifications", type, (val) => !val);
  },

  togglePrivacy(setting: keyof PrivacySettings): void {
    setStore("privacy", setting, (val) => !val);
  },

  updateEmail(email: string): void {
    setStore("account", "email", email);
  }
};

export { store as settingsStore };
