import { Show } from 'solid-js';
import { useAuth } from '../hooks/useAuth';
import styles from './auth.module.css';

export default function LoginForm() {
  const auth = useAuth();

  const handleGoogle = () => {
    auth.clearError();
    auth.signInWithOAuth('google');
  };

  return (
    <div class={styles.authContent}>
      <div class={styles.authHeader}>
        <h1 class={styles.authTitle}>Sign in</h1>
        <p class={styles.authSubtitle}>Continue with your Google account</p>
      </div>

      <button
        type="button"
        class={`${styles.oauthBtn} ${styles.oauthBtnGoogle}`}
        onClick={handleGoogle}
      >
        Continue with Google
      </button>

      <Show when={auth.error()}>
        <div class={styles.error}>{auth.error()}</div>
      </Show>
    </div>
  );
}
