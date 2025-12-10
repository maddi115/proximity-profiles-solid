import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import MainLayout from "./layouts/MainLayout";
import SheetLayout from "./layouts/SheetLayout";

// Lazy load routes - only load when accessed
const Home = lazy(() => import("./routes/index"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const UserProfile = lazy(() => import("./routes/UserProfile"));
const Settings = lazy(() => import("./routes/Settings"));
const ActivityHistory = lazy(() => import("./routes/ActivityHistory"));

/**
 * App - Root with lazy-loaded routes
 * Reduces initial bundle size and memory usage
 */
function App() {
  return (
    <Router>
      <Route path="/" component={MainLayout}>
        <Route path="/" component={Home} />
        
        <Route path="/" component={SheetLayout}>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/activity" component={ActivityHistory} />
        </Route>
      </Route>
    </Router>
  );
}

export default App;
