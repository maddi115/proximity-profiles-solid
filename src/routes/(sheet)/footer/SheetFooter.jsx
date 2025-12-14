import { Menu } from './menu/Menu';
import { AuthButton } from './auth-button/AuthButton';
import styles from './sheetFooter.module.css';

/**
 * SheetFooter - Persistent footer for all sheet routes
 * Contains Menu (left) and AuthButton (right)
 */
export function SheetFooter() {
  return (
    <div class={styles.sheetFooter}>
      <Menu />
      <AuthButton />
    </div>
  );
}
