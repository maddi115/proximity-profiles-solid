import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { authStore } from '../../../features/auth/store/DB_authStore';
import styles from './welcome-page.module.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  // Redirect if already logged in
  onMount(() => {
    if (authStore.isAuthenticated) {
      navigate('/home', { replace: true });
    }
  });

  const handleEnter = () => {
    navigate('/auth/login');
  };

  return (
    <div class={styles.welcomeContent}>
      <div class={styles.welcomeContainer}>
        <h1 class={styles.title}>Welcome</h1>
        
        <p class={styles.subtitle}>
          Placebook is a local directory  that connects people through shared physical spaces.
        </p>

        <div class={styles.locationBadge}>
          You are entering <span class={styles.highlighted}>Greenway Grocery</span>.
        </div>

        <ul class={styles.featureList}>
          <li class={styles.featureItem}>See who is here</li>
          <li class={styles.featureItem}>Discover familiar faces</li>
          <li class={styles.featureItem}>Leave quiet notes on profiles</li>
        </ul>

        <button class={styles.enterButton} onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}