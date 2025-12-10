import styles from './card.module.css';

/**
 * Shared Card component for sections
 */
export function Card(props) {
  return (
    <div class={`${styles.card} ${props.class || ''}`}>
      {props.title && (
        <div class={styles.cardHeader}>
          <h3 class={styles.cardTitle}>{props.title}</h3>
          {props.action && (
            <button class={styles.cardAction} onClick={props.onAction}>
              {props.action}
            </button>
          )}
        </div>
      )}
      <div class={styles.cardContent}>
        {props.children}
      </div>
    </div>
  );
}
