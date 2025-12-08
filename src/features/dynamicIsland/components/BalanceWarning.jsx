import { Show } from "solid-js";
import { store } from "../../proximity/store/proximityStore";
import styles from "./island.module.css";

/**
 * BalanceWarning - Standalone warning for low balance
 * Positioned to the right of DynamicIsland
 */
export function BalanceWarning() {
  const balance = () => store.balance;
  const isLowBalance = () => balance() < 5;
  
  return (
    <Show when={isLowBalance()}>
      <div class={styles.balanceWarning}>
        ⚠️ ${balance().toFixed(2)}
      </div>
    </Show>
  );
}
