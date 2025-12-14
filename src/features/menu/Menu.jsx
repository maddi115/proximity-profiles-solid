import { createSignal, For, Show } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import styles from './menu.module.css';

const menuItems = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'My Profile', path: '/my-profile', icon: '👤' },
  { label: 'Activity', path: '/activity', icon: '📝' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

/**
 * Menu dropdown with router-based navigation
 */
export function Menu() {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleMenuClick = (path) => {
    setIsOpen(false);
    if (path === 'logout') {
      console.log('Logging out...');
      // TODO: Implement logout logic
      return;
    }
    navigate(path);
  };

  return (
    <div 
      class={styles.menuContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button class={styles.menuButton}>
        ☰ Menu
      </button>

      <Show when={isOpen()}>
        <div class={styles.dropdown}>
          <For each={menuItems}>
            {(item) => (
              <button 
                class={styles.dropdownItem}
                onClick={() => handleMenuClick(item.path)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
