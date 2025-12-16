import { Router, Route, Navigate } from "@solidjs/router";
import { lazy, onMount } from "solid-js";
import { authActions } from "../features/auth/store/authStore";

import MainLayout from "../routes/_layout";
import SheetLayout from "../routes/(sheet)/_layout";

const Home = lazy(() => import("../routes/(sheet)/home/index"));
const Dashboard = lazy(() => import("../routes/(sheet)/dashboard"));
const MyProfile = lazy(() => import("../routes/(sheet)/my-profile"));
const Settings = lazy(() => import("../routes/(sheet)/settings"));
const ActivityHistory = lazy(() => import("../routes/(sheet)/activity"));
const Login = lazy(() => import("../routes/(sheet)/auth/login"));
const Messages = lazy(() => import("../routes/(sheet)/home/messages/index"));
const MessagesViewingProfile = lazy(() => import("../routes/(sheet)/home/messages/viewing-profile"));
const Following = lazy(() => import("../routes/(sheet)/home/following/index"));
const FollowingViewingProfile = lazy(() => import("../routes/(sheet)/home/following/viewing-profile"));

function App() {
  onMount(() => {
    authActions.initialize();
    authActions.setupAuthListener();
  });

  return (
    <Router>
      <Route path="/" component={MainLayout}>
        <Route path="/" component={() => <Navigate href="/home" />} />

        <Route path="/" component={SheetLayout}>
          <Route path="/auth/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/home/messages" component={Messages} />
          <Route path="/home/messages/viewing-profile" component={MessagesViewingProfile} />
          <Route path="/home/following" component={Following} />
          <Route path="/home/following/viewing-profile" component={FollowingViewingProfile} />
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
