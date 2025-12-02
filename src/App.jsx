import "./App.css";
import { ErrorBoundary } from "solid-js";
import { DynamicIsland } from "./features/proximity/components/DynamicIsland";
import { ProximityMap } from "./features/proximity/ProximityMap";

function App() {
  return (
    <div>
      <ErrorBoundary fallback={<div>dynamic island error 😵</div>}>
        <DynamicIsland />
      </ErrorBoundary>

      <ProximityMap />
    </div>
  );
}

export default App;
