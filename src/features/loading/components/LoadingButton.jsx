import { Show } from "solid-js";
import { LoadingSpinner } from "./LoadingSpinner";
import styles from "./loading.module.css";

/**
 * LoadingButton - Button with integrated loading state
 * 
 * Usage:
 * <LoadingButton 
 *   isLoading={isLoading} 
 *   onClick={handleClick}
 *   loadingText="Sending..."
 * >
 *   Send Pulse
 * </LoadingButton>
 */
export function LoadingButton(props) {
  const {
    isLoading,
    loadingText,
    disabled,
    onClick,
    class: className,
    children,
    ...rest
  } = props;
  
  const isDisabled = () => disabled || isLoading;
  
  const handleClick = (e) => {
    if (isDisabled()) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  return (
    <button
      {...rest}
      class={`${className || ''} ${isLoading ? styles.loadingButton : ''}`}
      disabled={isDisabled()}
      onClick={handleClick}
      aria-busy={isLoading}
    >
      <Show
        when={!isLoading}
        fallback={
          <div class={styles.loadingContent}>
            <LoadingSpinner size="small" />
            <Show when={loadingText}>
              <span class={styles.loadingText}>{loadingText}</span>
            </Show>
          </div>
        }
      >
        {children}
      </Show>
    </button>
  );
}
