import { z } from 'zod';

export const ActivityType = {
  PULSE: 'pulse',
  REVEAL: 'reveal',
  SLAP: 'slap',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow'
} as const;

// Coerce profileId to handle both number and string inputs
export const ActivitySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  type: z.enum(['pulse', 'reveal', 'slap', 'follow', 'unfollow']),
  emoji: z.string(),
  action: z.string(),
  profileId: z.coerce.string(), // ✨ Auto-converts numbers to strings
  cost: z.number().min(0)
});

export type Activity = z.infer<typeof ActivitySchema>;

// Helper to safely get numeric profile ID from activity
export function getProfileIdAsNumber(activity: Activity): number {
  return parseInt(activity.profileId, 10);
}

export function createActivity(
  type: Activity['type'],
  emoji: string,
  action: string,
  profileId: string | number, // ✨ Now accepts both!
  cost: number
): Activity {
  const activity = {
    id: Date.now().toString(),
    timestamp: new Date(),
    type,
    emoji,
    action,
    profileId: String(profileId), // ✨ Ensure it's a string
    cost
  };
  
  return ActivitySchema.parse(activity);
}
