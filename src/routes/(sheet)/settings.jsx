import { settingsStore, settingsActions } from '../../features/settings/store/settingsStore';
import { SettingsSection } from '../../features/settings/components/SettingsSection';
import { ThemeToggle } from '../../features/settings/components/ThemeToggle';
import styles from '../routes.module.css';

export default function Settings() {
  const handleLogout = () => {
    console.log('🚪 Logging out...');
    alert('Logout functionality coming soon!');
  };

  return (
    <div class={styles.pageContent}>
      <h1 class={styles.pageTitle}>Settings</h1>

      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Notifications</h3>
        <SettingsSection
          label="Pulse Notifications"
          description="Get notified when someone pulses you"
          checked={settingsStore.notifications.pulse}
          onToggle={() => settingsActions.toggleNotification('pulse')}
        />
        <SettingsSection
          label="Reveal Notifications"
          description="Get notified when someone reveals you"
          checked={settingsStore.notifications.reveal}
          onToggle={() => settingsActions.toggleNotification('reveal')}
        />
        <SettingsSection
          label="Slap Notifications"
          description="Get notified when someone slaps you"
          checked={settingsStore.notifications.slap}
          onToggle={() => settingsActions.toggleNotification('slap')}
        />
        <SettingsSection
          label="Follow Notifications"
          description="Get notified when someone follows you"
          checked={settingsStore.notifications.follow}
          onToggle={() => settingsActions.toggleNotification('follow')}
        />
        <SettingsSection
          label="Sound Effects"
          description="Play sounds for notifications"
          checked={settingsStore.notifications.sound}
          onToggle={() => settingsActions.toggleNotification('sound')}
        />
      </div>

      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Privacy</h3>
        <SettingsSection
          label="Show Location"
          description="Allow others to see your proximity"
          checked={settingsStore.privacy.showLocation}
          onToggle={() => settingsActions.togglePrivacy('showLocation')}
        />
        <SettingsSection
          label="Allow Pulses"
          description="Let others send you pulses"
          checked={settingsStore.privacy.allowPulses}
          onToggle={() => settingsActions.togglePrivacy('allowPulses')}
        />
        <SettingsSection
          label="Allow Reveals"
          description="Let others reveal your profile"
          checked={settingsStore.privacy.allowReveals}
          onToggle={() => settingsActions.togglePrivacy('allowReveals')}
        />
      </div>

      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Appearance</h3>
        <ThemeToggle />
      </div>

      <div class={styles.settingsGroup}>
        <h3 class={styles.groupTitle}>Account</h3>
        <div class={styles.accountInfo}>
          <div class={styles.accountItem}>
            <span class={styles.accountLabel}>Email</span>
            <span class={styles.accountValue}>{settingsStore.account.email}</span>
          </div>
        </div>
        <button class={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
