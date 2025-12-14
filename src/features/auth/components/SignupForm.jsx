import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../hooks/useAuth';
import { LoadingButton } from '../../loading/components/LoadingButton';
import styles from './auth.module.css';

export function SignupForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [username, setUsername] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    auth.clearError();

    const result = await auth.signUp(email(), password(), {
      username: username()
    });
    
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div class={styles.authContainer}>
      <div class={styles.authCard}>
        <div class={styles.authHeader}>
          <h1 class={styles.authTitle}>Create Account</h1>
          <p class={styles.authSubtitle}>Join Proximity Profiles</p>
        </div>

        <form class={styles.authForm} onSubmit={handleSubmit}>
          <div class={styles.formGroup}>
            <label class={styles.label}>Username</label>
            <input
              type="text"
              class={styles.input}
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
              autocomplete="username"
            />
          </div>

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
              autocomplete="new-password"
              minlength="6"
            />
            <p class={styles.hint}>Minimum 6 characters</p>
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
            loadingText="Creating account..."
          >
            Sign Up
          </LoadingButton>
        </form>

        <div class={styles.authFooter}>
          <p>
            Already have an account?{' '}
            <a href="/login" class={styles.link}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
