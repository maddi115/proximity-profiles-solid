import { Show, createSignal } from 'solid-js';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { LoginModal } from '../../../../features/auth/components/LoginModal';
import styles from './authButton.module.css';

export function AuthButton() {
  const auth = useAuth();
  const [showModal, setShowModal] = createSignal(false);

  const handleClick = async () => {
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
      >
        <Show
          when={auth.isAuthenticated()}
          fallback={<>🔐 Login</>}
        >
          🚪 Logout
        </Show>
      </button>

      <Show when={showModal()}>
        <LoginModal onClose={() => setShowModal(false)} />
      </Show>
    </>
  );
}
