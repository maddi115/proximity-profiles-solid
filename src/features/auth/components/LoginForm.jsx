import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../hooks/useAuth';
import { LoadingButton } from '../../loading/components/LoadingButton';
import styles from './auth.module.css';

export default function LoginForm() {
  const navigate = useNavigate();
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
      navigate('/'); // Go back to map
    }
  };

  return (
    <div class={styles.authContent}>
      <div class={styles.authHeader}>
        <h1 class={styles.authTitle}>Welcome Back</h1>
        <p class={styles.authSubtitle}>Sign in to continue</p>
      </div>

      <form class={styles.authForm} onSubmit={handleSubmit}>
        <div class={styles.formGroup}>
          <label class={styles.label}>Email</label>
          <input
            type="email"
            class={styles.input}
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class={styles.formGroup}>
          <label class={styles.label}>Password</label>
          <input
            type="password"
            class={styles.input}
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <Show when={auth.error()}>
          <div class={styles.error}>
            {auth.error()}
          </div>
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

      <div class={styles.authFooter}>
        <p>
          Don't have an account?{' '}
          <a href="/signup" class={styles.link}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
