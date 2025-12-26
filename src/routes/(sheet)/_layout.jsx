import { Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { SheetFooter } from "./footer/SheetFooter";
import styles from "./sheetLayout.module.css";

export default function SheetLayout(props) {
  const location = useLocation();
  
  // Hide footer on welcome page and login page
  const showFooter = () => {
    const path = location.pathname;
    return !path.includes('/welcome-page') && !path.includes('/auth/login');
  };

  return (
    <div class={styles.sheetLayoutContainer}>
      <div class={styles.sheetOverlay}>
        <div class={styles.sheetCard}>
          <div class={styles.sheetScrollContent}>
            {props.children}
          </div>
          <Show when={showFooter()}>
            <SheetFooter />
          </Show>
        </div>
      </div>
    </div>
  );
}
