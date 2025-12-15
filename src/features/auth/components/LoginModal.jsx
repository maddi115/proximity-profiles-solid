import { createSignal, Show } from 'solid-js';
import { useAuth } from '../hooks/useAuth';
import { LoadingButton } from '../../loading/components/LoadingButton';
import styles from './loginModal.module.css';

export function LoginModal(props) {
  const auth = useAuth();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    auth.clearError();

    const result = await auth.signIn(email(), password());
    setIsLoading(false);

    if (result.success) {
      props.onClose();
    }
  };

  const handleGoogleSignIn = () => {
    auth.clearError();
    auth.signInWithOAuth('google');
  };

  return (
    <>
      <div class={styles.backdrop} onClick={props.onClose} />
      <div class={styles.modal}>
        <div class={styles.modalHeader}>
          <h2 class={styles.modalTitle}>Login</h2>
          <button class={styles.closeBtn} onClick={props.onClose}>✕</button>
        </div>

        <form class={styles.form} onSubmit={handleSubmit}>
          <div class={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              class={styles.input}
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div class={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              class={styles.input}
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Show when={auth.error()}>
            <div class={styles.error}>{auth.error()}</div>
          </Show>

          <LoadingButton
            type="submit"
            class={styles.submitBtn}
            isLoading={isLoading()}
            loadingText="Signing in..."
          >
            Sign In
          </LoadingButton>
        </form>

        {/* OAuth */}
        <div class={styles.oauthSection}>
          <button
            type="button"
            class={styles.oauthBtn}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}
