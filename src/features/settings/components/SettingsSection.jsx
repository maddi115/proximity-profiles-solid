import styles from "./settings.module.css";

/**
 * SettingsSection - Reusable settings section with toggle
 */
export function SettingsSection(props) {
  return (
    <div class={styles.settingRow}>
      <div class={styles.settingInfo}>
        <div class={styles.settingLabel}>{props.label}</div>
        {props.description && (
          <div class={styles.settingDesc}>{props.description}</div>
        )}
      </div>
      <label class={styles.toggle}>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={() => props.onToggle()}
        />
        <span class={styles.toggleSlider}></span>
      </label>
    </div>
  );
}
