import { settingsStore, settingsActions } from "../store/settingsStore";
import styles from "./settings.module.css";

/**
 * ThemeToggle - Switch between dark/light theme
 */
export function ThemeToggle() {
  const toggleTheme = () => {
    const newTheme = settingsStore.theme === 'dark' ? 'light' : 'dark';
    settingsActions.setTheme(newTheme);
  };
  
  return (
    <div class={styles.settingRow}>
      <div class={styles.settingInfo}>
        <div class={styles.settingLabel}>Theme</div>
        <div class={styles.settingDesc}>
          Choose your preferred color scheme
        </div>
      </div>
      <button 
        class={styles.themeToggle}
        onClick={toggleTheme}
      >
        {settingsStore.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
