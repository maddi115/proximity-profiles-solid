import { Show } from "solid-js";
import { store } from "../../../../../features/proximity/store/proximityStore";
import styles from "../island.module.css";

/**
 * BalanceWarning - Displays low balance warning in Dynamic Island
 */
export const BalanceWarning = () => {
  const isLowBalance = () => store.balance < 1;

  return (
    <Show when={isLowBalance()}>
      <div class={styles.balanceWarning}>
        ⚠️ Low Balance: ${store.balance.toFixed(2)}
      </div>
    </Show>
  );
};
