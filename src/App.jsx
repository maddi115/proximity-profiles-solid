import { Router, Route } from "@solidjs/router";
import { lazy, onMount } from "solid-js";
import { authActions } from "./features/auth/store/authStore";

// Layouts
import MainLayout from "./routes/_layout";
import SheetLayout from "./routes/(sheet)/_layout";

// Routes
const Home = lazy(() => import("./routes/index"));
const Dashboard = lazy(() => import("./routes/(sheet)/dashboard"));
const MyProfile = lazy(() => import("./routes/(sheet)/my-profile"));
const Settings = lazy(() => import("./routes/(sheet)/settings"));
const ActivityHistory = lazy(() => import("./routes/(sheet)/activity"));

function App() {
  onMount(() => {
    authActions.initialize();
    authActions.setupAuthListener();
  });

  return (
    <Router>
      <Route path="/" component={MainLayout}>
        <Route path="/" component={Home} />
        
        <Route path="/" component={SheetLayout}>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/my-profile" component={MyProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/activity" component={ActivityHistory} />
        </Route>
      </Route>
    </Router>
  );
}

export default App;
