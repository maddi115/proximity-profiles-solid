import { Router, Route, Navigate } from "@solidjs/router";
import { lazy, onMount } from "solid-js";
import { authActions } from "../features/auth/store/authStore";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

import MainLayout from "../routes/_layout";
import SheetLayout from "../routes/(sheet)/_layout";

const Home = lazy(() => import("../routes/(sheet)/home/index"));
const MyProfile = lazy(() => import("../routes/(sheet)/my-profile"));
const Settings = lazy(() => import("../routes/(sheet)/settings"));
const ActivityHistory = lazy(() => import("../routes/(sheet)/activity"));
const Login = lazy(() => import("../routes/(sheet)/auth/login"));
const Messages = lazy(() => import("../routes/(sheet)/home/messages/index"));
const Conversation = lazy(() => import("../routes/(sheet)/home/messages/conversation"));
const MessagesViewingProfile = lazy(() => import("../routes/(sheet)/home/messages/viewing-profile"));
const Following = lazy(() => import("../routes/(sheet)/home/following/index"));
const FollowingViewingProfile = lazy(() => import("../routes/(sheet)/home/following/viewing-profile"));
const MyStory = lazy(() => import("../routes/(sheet)/home/my-story/index"));
const WelcomePage = lazy(() => import("../routes/(sheet)/welcome-page/index"));

function App() {
  onMount(() => {
    authActions.initialize();
    authActions.setupAuthListener();
  });

  return (
    <Router>
      <Route path="/" component={MainLayout}>
        <Route path="/" component={() => <Navigate href="/welcome-page" />} />

        <Route path="/" component={SheetLayout}>
          <Route path="/auth/login" component={Login} />
          <Route path="/welcome-page" component={WelcomePage} />
          
          {/* Protected routes - require authentication */}
          <Route path="/home" component={() => <ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home/my-story" component={() => <ProtectedRoute><MyStory /></ProtectedRoute>} />
          <Route path="/home/messages" component={() => <ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/home/messages/conversation" component={() => <ProtectedRoute><Conversation /></ProtectedRoute>} />
          <Route path="/home/messages/viewing-profile" component={() => <ProtectedRoute><MessagesViewingProfile /></ProtectedRoute>} />
          <Route path="/home/following" component={() => <ProtectedRoute><Following /></ProtectedRoute>} />
          <Route path="/home/following/viewing-profile" component={() => <ProtectedRoute><FollowingViewingProfile /></ProtectedRoute>} />
          <Route path="/my-profile" component={() => <ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/settings" component={() => <ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/activity" component={() => <ProtectedRoute><ActivityHistory /></ProtectedRoute>} />
        </Route>
      </Route>
    </Router>
  );
}

export default App;
