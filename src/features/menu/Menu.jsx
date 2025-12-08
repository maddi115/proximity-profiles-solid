import { createSignal, Show } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import styles from "./menu.module.css";

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
    if (path === 'logout') {
      console.log('Logging out...');
      // TODO: Implement logout logic
      setIsOpen(false);
      return;
    }
    
    navigate(path);
    setIsOpen(false);
  };
  
  const menuItems = [
    { label: "Front Page", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
    { label: "Activity History", path: "/activity" },
    { label: "Logout", path: "logout", danger: true }
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
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Show>
    </div>
  );
}
