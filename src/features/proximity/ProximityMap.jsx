import { onMount } from "solid-js";
import { profiles } from "./data";
import { proximityActions } from "../../store/proximityStore";
import { AppleWatchGrid } from "./components/AppleWatchGrid";
import { ProfileSheet } from "./components/ProfileSheet";
import { useProfileSelection } from "./hooks/useProfileSelection";

/**
 * Main container for proximity-based profile interaction
 * Manages grid display and profile selection
 */
export function ProximityMap() {
  const selection = useProfileSelection(profiles[0]);
  
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });
  
  const handleProfileClick = (profile) => {
    selection.selectProfile(profile);
  };
  
  const handleCenterProfileChange = (profileId) => {
    selection.selectProfileById(profileId, profiles);
  };
  
  return (
    <div>
      <AppleWatchGrid 
        profiles={profiles} 
        onProfileClick={handleProfileClick}
        onCenterProfileChange={handleCenterProfileChange}
      />
      
      <ProfileSheet profile={selection.profileWithStoreData()} />
    </div>
  );
}
