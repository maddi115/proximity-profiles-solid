import styles from "./loading.module.css";

/**
 * LoadingSpinner - Reusable spinner component
 */
export function LoadingSpinner(props) {
  const size = props.size || 'medium';
  
  return (
    <div class={`${styles.spinner} ${styles[size]}`} aria-label="Loading">
      <div class={styles.spinnerCircle}></div>
    </div>
  );
}
