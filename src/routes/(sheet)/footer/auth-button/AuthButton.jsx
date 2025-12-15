import { Show, createSignal, createMemo } from 'solid-js';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { LoginModal } from '../../../../features/auth/components/LoginModal';
import styles from './authButton.module.css';

export function AuthButton() {
  const auth = useAuth();
  const [showModal, setShowModal] = createSignal(false);

  const label = createMemo(() => {
    const user = auth.user();
    return user?.email || user?.user_metadata?.username || 'Account';
  });

  const handleClick = async () => {
    if (auth.isLoading()) return;

    if (auth.isAuthenticated()) {
      await auth.signOut();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        class={styles.authBtn}
        onClick={handleClick}
        disabled={auth.isLoading()}
        title={auth.isAuthenticated() ? label() : 'Login'}
      >
        <Show
          when={auth.isAuthenticated()}
          fallback={<>🔐 Login</>}
        >
          🚪 Logout <span style={{ 'font-size': '0.85em', opacity: 0.85 }}>({label()})</span>
        </Show>
      </button>

      <Show when={showModal()}>
        <LoginModal onClose={() => setShowModal(false)} />
      </Show>
    </>
  );
}
