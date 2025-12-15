import { SheetFooter } from './footer/SheetFooter';
import styles from './sheetLayout.module.css';

export default function SheetLayout(props) {
  return (
    <div class={styles.sheetLayoutContainer}>
      <div class={styles.sheetOverlay}>
        <div class={styles.sheetCard}>
          {/* Content row */}
          <div class={styles.sheetScrollContent}>
            {props.children}

            {/* Overlay mount INSIDE content row */}
            <div id="sheet-overlay-root" />
          </div>

          {/* Footer row */}
          <SheetFooter />
        </div>
      </div>
    </div>
  );
}
