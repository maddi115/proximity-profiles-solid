import { createStore } from "solid-js/store";

/**
 * Activity Store
 * Tracks all user actions for history display
 */

const [store, setStore] = createStore({
  activities: []
});

export const activityActions = {
  /**
   * Add a new activity
   */
  addActivity(activity) {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...activity
    };
    
    // Add to beginning of array (newest first)
    setStore("activities", [newActivity, ...store.activities]);
    
    console.log('📝 Activity logged:', newActivity);
  },
  
  /**
   * Clear all activities
   */
  clearActivities() {
    setStore("activities", []);
  },
  
  /**
   * Get activities for display
   */
  getActivities() {
    return store.activities;
  }
};

export { store as activityStore };
