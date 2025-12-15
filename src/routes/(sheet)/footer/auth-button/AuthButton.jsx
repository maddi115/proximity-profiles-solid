import { Show, createMemo } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import styles from './authButton.module.css';

export function AuthButton() {
  const auth = useAuth();
  const navigate = useNavigate();

  const label = createMemo(() => {
    const user = auth.user();
    return user?.email || user?.user_metadata?.username || 'Account';
  });

  const handleClick = async () => {
    if (auth.isLoading()) return;

    if (auth.isAuthenticated()) {
      await auth.signOut();
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <button
      class={styles.authBtn}
      onClick={handleClick}
      disabled={auth.isLoading()}
      title={auth.isAuthenticated() ? label() : 'Login'}
    >
      <Show when={auth.isAuthenticated()} fallback={<>🔐 Login</>}>
        🚪 Logout <span style={{ 'font-size': '0.85em', opacity: 0.85 }}>({label()})</span>
      </Show>
    </button>
  );
}
