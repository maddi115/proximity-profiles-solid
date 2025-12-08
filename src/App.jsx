import { Router, Route } from "@solidjs/router";
import MainLayout from "./layouts/MainLayout";
import SheetLayout from "./layouts/SheetLayout";
import Home from "./routes/index";
import Dashboard from "./routes/Dashboard";
import UserProfile from "./routes/UserProfile";
import Settings from "./routes/Settings";
import ActivityHistory from "./routes/ActivityHistory";

/**
 * App - Root component with routing
 * 
 * ROUTING ARCHITECTURE:
 * 
 * MainLayout (renders ProximityMap ONCE - persists across all routes)
 *   │
 *   ├─ Home (/) - Shows ProximityMap with ProfileSheet only
 *   │
 *   └─ SheetLayout (adds bottom sheet overlay)
 *       ├─ /dashboard - Dashboard content in sheet
 *       ├─ /profile - User Profile content in sheet
 *       ├─ /settings - Settings content in sheet
 *       └─ /activity - Activity History content in sheet
 * 
 * KEY CONCEPT:
 * ProximityMap is rendered in MainLayout, so it stays visible and
 * in the same position when you navigate between menu pages.
 * Only the sheet content changes.
 */
function App() {
  return (
    <Router>
      {/* MainLayout wraps everything - ProximityMap renders here (ONCE) */}
      <Route path="/" component={MainLayout}>
        
        {/* Home route: Just ProximityMap + ProfileSheet (no overlay) */}
        <Route path="/" component={Home} />
        
        {/* Menu routes: ProximityMap (background) + SheetLayout (overlay) */}
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
