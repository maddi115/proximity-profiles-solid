import { Show, createSignal } from 'solid-js';
import { useAuth } from '../hooks/useAuth';
import styles from './authButton.module.css';
import { LoginModal } from './LoginModal';

export function AuthButton() {
  const auth = useAuth();
  const [showModal, setShowModal] = createSignal(false);

  const handleClick = async () => {
    if (auth.isAuthenticated()) {
      // Logout
      await auth.signOut();
    } else {
      // Show login modal
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
