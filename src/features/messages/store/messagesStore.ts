import { createStore } from "solid-js/store";
import { activityStore } from "../../notifications/store/activityStore";
import { authStore } from "../../auth/store/authStore";
import type { Activity } from "../../../types/activity";

export interface Message extends Activity {
  direction: 'sent' | 'received';
  fromUserId?: string;
  toUserId?: string;
}

interface MessagesStore {
  messages: Message[];
}

const [store, setStore] = createStore<MessagesStore>({
  messages: []
});

export const messagesActions = {
  // Get all messages (both sent and received)
  getAllMessages(): Message[] {
    const currentUserId = authStore.user?.id;
    
    // Convert activities to messages with direction
    return activityStore.activities.map(activity => ({
      ...activity,
      direction: 'sent' as const, // For now, all activities are outgoing
      fromUserId: currentUserId,
      toUserId: activity.profileId
    }));
  },

  // Get unread count
  getUnreadCount(): number {
    // TODO: Implement read/unread tracking
    return 0;
  }
};

export const messagesStore = store;
