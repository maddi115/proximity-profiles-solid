import { onMount } from "solid-js";
import { AppleWatchGrid } from "./components/AppleWatchGrid";
import { ProfileSheet } from "./components/ProfileSheet";
import { useProfileSelection } from "./hooks/useProfileSelection";
import { profiles } from "./mockData";
import { proximityActions } from "./store/proximityStore";

/**
 * ProximityMap - Main proximity profiles view
 * 
 * COMPONENTS:
 * - AppleWatchGrid: Interactive honeycomb profile grid
 * - ProfileSheet: Bottom sheet with selected profile details (includes DynamicIsland)
 * 
 * PERSISTENCE:
 * This component is rendered in MainLayout and persists across all routes.
 */
export function ProximityMap() {
  const selection = useProfileSelection(profiles[0]);
  
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });
  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Center: Apple Watch honeycomb grid */}
      <AppleWatchGrid 
        profiles={profiles} 
        onProfileClick={selection.selectProfile}
        onCenterProfileChange={(id) => selection.selectProfileById(id, profiles)}
      />
      
      {/* Bottom: Profile sheet with actions and DynamicIsland */}
      <ProfileSheet profile={selection.profileWithStoreData()} />
    </div>
  );
}
