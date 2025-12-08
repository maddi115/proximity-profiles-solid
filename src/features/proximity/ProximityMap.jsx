import { onMount } from "solid-js";
import { AppleWatchGrid } from "./components/AppleWatchGrid";
import { ProfileSheet } from "./components/ProfileSheet";
import { DynamicIsland } from "./components/DynamicIsland";
import { useProfileSelection } from "./hooks/useProfileSelection";
import { profiles } from "./mockData";
import { proximityActions } from "./store/proximityStore";

/**
 * ProximityMap - Main proximity profiles view
 * 
 * COMPONENTS:
 * - DynamicIsland: Top notifications bar
 * - AppleWatchGrid: Interactive honeycomb profile grid
 * - ProfileSheet: Bottom sheet with selected profile details
 * 
 * PERSISTENCE:
 * This component is rendered in MainLayout and persists across all routes.
 * When you navigate to /dashboard, /settings, etc., this component stays
 * mounted and visible in the background. Only the sheet overlay changes.
 */
export function ProximityMap() {
  const selection = useProfileSelection(profiles[0]);
  
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });
  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Top: Dynamic Island for notifications */}
      <DynamicIsland />
      
      {/* Center: Apple Watch honeycomb grid */}
      <AppleWatchGrid 
        profiles={profiles} 
        onProfileClick={selection.selectProfile}
        onCenterProfileChange={(id) => selection.selectProfileById(id, profiles)}
      />
      
      {/* Bottom: Profile sheet with actions */}
      <ProfileSheet profile={selection.profileWithStoreData()} />
    </div>
  );
}
