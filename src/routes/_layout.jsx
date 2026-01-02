import { onMount } from "solid-js";
import { authActions } from "../features/auth/store/DB_authStore";
import { ProximityMap } from "../features/proximity/ProximityMap";
import { BalanceWarning } from "./(sheet)/home/dynamicIsland/components/BalanceWarning";
import styles from "./mainLayout.module.css";

export default function MainLayout(props) {
  onMount(() => {
    authActions.initialize();
    authActions.setupAuthListener();
  });

  return (
    <div class={styles.mainLayout}>
      <ProximityMap />
      <BalanceWarning />
      {props.children}
    </div>
  );
}
