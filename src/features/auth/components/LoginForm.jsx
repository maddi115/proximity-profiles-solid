import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../hooks/useAuth';
import styles from './auth.module.css';

export default function LoginForm() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleGoogle = () => {
    auth.clearError();
    auth.signInWithOAuth('google');
  };

  // ========================================================================
  // GUEST MODE (DEVELOPMENT ONLY)
  // Bypasses real authentication to test app without Supabase
  // ========================================================================
  const handleGuestMode = () => {
    auth.clearError();
    auth.skipAuth();
    navigate('/home');
  };

  return (
    <div class={styles.authContent}>
      <div class={styles.authHeader}>
        <h1 class={styles.authTitle}>Sign in</h1>
        <p class={styles.authSubtitle}>Continue with your Google account</p>
      </div>

      {/* Real OAuth Authentication */}
      <button
        type="button"
        class={`${styles.oauthBtn} ${styles.oauthBtnGoogle}`}
        onClick={handleGoogle}
      >
        Continue with Google
      </button>

      {/* GUEST MODE - Development Only */}
      <button
        type="button"
        class={styles.oauthBtn}
        onClick={handleGuestMode}
        style={{
          "margin-top": "12px",
          "background": "#6b7280",
          "color": "white",
          "border": "2px dashed #9ca3af"
        }}
      >
        🔓 Continue Without Profile (Guest Mode)
      </button>

      <Show when={auth.error()}>
        <div class={styles.error}>{auth.error()}</div>
      </Show>
    </div>
  );
}
