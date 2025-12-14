import styles from './sheetLayout.module.css';
import { Menu } from '../../features/menu/Menu';
import { AuthButton } from '../../features/auth/components/AuthButton';

/**
 * Sheet Layout - Bottom sheet overlay for menu pages
 */
export default function SheetLayout(props) {
  return (
    <div class={styles.sheetLayoutContainer}>
      <div class={styles.sheetOverlay}>
        <div class={styles.sheetCard}>
          <div class={styles.sheetScrollContent}>
            {props.children}
          </div>

          <div class={styles.sheetFooter}>
            <Menu />
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
