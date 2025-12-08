import { createSignal, Show } from "solid-js";
import styles from "./menu.module.css";

/**
 * Menu dropdown with navigation to different pages
 * @param {Object} props
 * @param {Function} props.onNavigate - Callback when menu item is clicked
 */
export function Menu(props) {
  const [isOpen, setIsOpen] = createSignal(false);
  
  const handleMouseEnter = () => {
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  
  const handleMenuClick = (page) => {
    if (page === 'logout') {
      console.log('Logging out...');
      // TODO: Implement logout logic
      setIsOpen(false);
      return;
    }
    
    props.onNavigate?.(page);
    setIsOpen(false);
  };
  
  const menuItems = [
    { label: "Dashboard", value: "dashboard" },
    { label: "My Profile", value: "userProfile" },
    { label: "Settings", value: "settings" },
    { label: "Activity History", value: "activity" },
    { label: "Logout", value: "logout", danger: true }
  ];
  
  return (
    <div 
      class={styles.menuContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button class={styles.menuButton}>
        Menu
      </button>
      
      <Show when={isOpen()}>
        <div class={styles.dropdown}>
          {menuItems.map((item) => (
            <button
              class={`${styles.dropdownItem} ${item.danger ? styles.dangerItem : ''}`}
              onClick={() => handleMenuClick(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Show>
    </div>
  );
}
