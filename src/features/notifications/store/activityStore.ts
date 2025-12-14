import { createStore } from "solid-js/store";
import { Activity, ActivitySchema } from "../../../types/activity";

const MAX_ACTIVITIES = 50;

interface ActivityStore {
  activities: Activity[];
}

const [store, setStore] = createStore<ActivityStore>({
  activities: []
});

export const activityActions = {
  addActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
    const newActivity: Activity = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...activity
    };
    
    const validated = ActivitySchema.parse(newActivity);
    
    const newActivities = [validated, ...store.activities].slice(0, MAX_ACTIVITIES);
    setStore("activities", newActivities);
    
    console.log('📝 Activity logged:', validated.action, `(${store.activities.length}/${MAX_ACTIVITIES})`);
  },

  clearActivities() {
    setStore("activities", []);
  }
};

export const activityStore = store;
