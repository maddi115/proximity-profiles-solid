import { SheetFooter } from './footer/SheetFooter';
import styles from './sheetLayout.module.css';

/**
 * SheetLayout - Bottom sheet overlay for menu pages
 */
export default function SheetLayout(props) {
  return (
    <div class={styles.sheetLayoutContainer}>
      <div class={styles.sheetOverlay}>
        <div class={styles.sheetCard}>
          <div class={styles.sheetScrollContent}>
            {props.children}
          </div>

          <SheetFooter />
        </div>
      </div>
    </div>
  );
}
