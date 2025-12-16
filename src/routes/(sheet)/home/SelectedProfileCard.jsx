import styles from './home.module.css';

export function SelectedProfileCard(props) {
  return (
    <div class={styles.profileCard}>
      <img
        src={props.profile.img}
        class={styles.avatar}
        alt={props.profile.name || 'Profile'}
      />
    </div>
  );
}
