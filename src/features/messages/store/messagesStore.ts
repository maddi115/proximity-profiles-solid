import { createStore } from "solid-js/store";
import { activityStore } from "../../notifications/store/activityStore";
import { authStore } from "../../auth/store/authStore";
import type { Activity } from "../../../types/activity";

export interface Message extends Activity {
  direction: 'sent' | 'received';
  fromUserId?: string;
  toUserId?: string;
}

export interface GroupedConversation {
  profileId: string;
  messages: Message[];
  latestMessage: Message;
  messageCount: number;
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

    // For now, all activities are outgoing (sent by current user)
    const sentMessages = activityStore.activities.map(activity => ({
      ...activity,
      direction: 'sent' as const,
      fromUserId: currentUserId,
      toUserId: activity.profileId
    }));

    // TODO: Add received messages from other users when backend is ready
    const receivedMessages: Message[] = [];

    return [...sentMessages, ...receivedMessages];
  },

  // Group messages by person (combines sent + received for same person)
  getGroupedConversations(): GroupedConversation[] {
    const messages = this.getAllMessages();
    const grouped = new Map<string, Message[]>();

    // Group by profileId (the other person in conversation)
    messages.forEach(message => {
      const otherPersonId = message.direction === 'sent' 
        ? message.profileId  // If I sent it, group by recipient
        : message.fromUserId || message.profileId;  // If received, group by sender
      
      if (!grouped.has(otherPersonId)) {
        grouped.set(otherPersonId, []);
      }
      grouped.get(otherPersonId)!.push(message);
    });

    // Convert to array and sort by latest message
    return Array.from(grouped.entries()).map(([profileId, msgs]) => {
      const sorted = msgs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      return {
        profileId,
        messages: sorted,
        latestMessage: sorted[0],
        messageCount: msgs.length
      };
    }).sort((a, b) => 
      b.latestMessage.timestamp.getTime() - a.latestMessage.timestamp.getTime()
    );
  },

  // Get messages with specific person (both directions)
  getConversationWith(profileId: string): Message[] {
    return this.getAllMessages()
      .filter(msg => {
        // Include if: I sent to them OR they sent to me
        return msg.profileId === profileId || msg.fromUserId === profileId;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Get unread count
  getUnreadCount(): number {
    // TODO: Implement read/unread tracking
    return 0;
  }
};

export const messagesStore = store;
