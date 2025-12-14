import styles from './home.module.css';

export function SelectedProfileCard(props) {
  return (
    <div class={styles.profileCard}>
      <img 
        src={props.profile.img} 
        class={styles.avatar} 
        alt={props.profile.name || 'Profile'}
      />
      <div class={styles.balance}>
        ${Number(props.profile.balance || 0).toFixed(2)}
      </div>
    </div>
  );
}
