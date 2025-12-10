import { createStore } from "solid-js/store";

/**
 * Activity Store
 * Optimized: Stores only profile IDs, not full objects
 */

const MAX_ACTIVITIES = 50; // Reduced from 100

const [store, setStore] = createStore({
  activities: []
});

export const activityActions = {
  addActivity(activity) {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: activity.type,
      emoji: activity.emoji,
      action: activity.action,
      profileId: activity.targetProfile?.id, // Only store ID
      cost: activity.cost
    };
    
    const newActivities = [newActivity, ...store.activities].slice(0, MAX_ACTIVITIES);
    setStore("activities", newActivities);
    
    console.log('📝 Activity logged:', newActivity.action, `(${store.activities.length}/${MAX_ACTIVITIES})`);
  },
  
  clearActivities() {
    setStore("activities", []);
  },
  
  getActivities() {
    return store.activities;
  }
};

export { store as activityStore };
