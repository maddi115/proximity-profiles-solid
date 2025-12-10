import { settingsStore, settingsActions } from "../features/settings/store/settingsStore";
import { ThemeToggle } from "../features/settings/components/ThemeToggle";
import { SettingsSection } from "../features/settings/components/SettingsSection";
import { Card } from "../features/profile/components/Card";
import styles from "./routes.module.css";

/**
 * Settings - User preferences and account settings
 */
export default function Settings() {
  const handleLogout = () => {
    console.log('🚪 Logging out...');
    // TODO: Clear auth token, redirect to login
    alert('Logout functionality coming soon!');
  };
  
  return (
    <div class={styles.pageContent}>
      <h2 class={styles.pageTitle}>Settings</h2>
      
      <Card title="Appearance">
        <ThemeToggle />
      </Card>
      
      <Card title="Notifications">
        <SettingsSection
          label="Pulse Notifications"
          description="Get notified when someone sends you a pulse"
          checked={settingsStore.notifications.pulse}
          onToggle={() => settingsActions.toggleNotification('pulse')}
        />
        <SettingsSection
          label="Reveal Notifications"
          description="Get notified when your profile is revealed"
          checked={settingsStore.notifications.reveal}
          onToggle={() => settingsActions.toggleNotification('reveal')}
        />
        <SettingsSection
          label="Slap Notifications"
          description="Get notified when you receive a slap"
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
      </Card>
      
      <Card title="Privacy">
        <SettingsSection
          label="Show Location"
          description="Allow others to see your approximate location"
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
      </Card>
      
      <Card title="Account">
        <div class={styles.accountInfo}>
          <div class={styles.accountItem}>
            <div class={styles.accountLabel}>Email</div>
            <div class={styles.accountValue}>{settingsStore.account.email}</div>
          </div>
          <div class={styles.accountItem}>
            <div class={styles.accountLabel}>Status</div>
            <div class={styles.accountValue}>
              {settingsStore.account.emailVerified ? '✓ Verified' : '⚠️ Unverified'}
            </div>
          </div>
        </div>
        
        <button class={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </Card>
    </div>
  );
}
