import { onMount } from 'solid-js';
import { AppleWatchGrid } from './components/AppleWatchGrid';
import { profiles } from './mockData';
import { proximityActions } from './store/proximityStore';
import { selectedProfileActions } from './store/selectedProfileStore';

/**
 * ProximityMap - Main proximity profiles view
 * Updates selectedProfileStore when profiles are clicked or centered
 */
export function ProximityMap() {
  onMount(() => {
    proximityActions.initializeProfiles(profiles);
  });

  const handleProfileClick = (profile) => {
    console.log('👆 Profile clicked:', profile.id);
    selectedProfileActions.selectProfile(profile);
  };

  const handleCenterProfileChange = (id) => {
    console.log('🎯 Center profile changed:', id);
    selectedProfileActions.selectProfileById(id);
  };

  return (
    <AppleWatchGrid
      profiles={profiles}
      onProfileClick={handleProfileClick}
      onCenterProfileChange={handleCenterProfileChange}
    />
  );
}
