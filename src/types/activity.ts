import { z } from 'zod';

export const ActivityType = {
  PULSE: 'pulse',
  REVEAL: 'reveal',
  SLAP: 'slap',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow'
} as const;

export const ActivitySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  type: z.enum(['pulse', 'reveal', 'slap', 'follow', 'unfollow']),
  emoji: z.string(),
  action: z.string(),
  profileId: z.string(),
  cost: z.number().min(0)
});

export type Activity = z.infer<typeof ActivitySchema>;

export function createActivity(
  type: Activity['type'],
  emoji: string,
  action: string,
  profileId: string,
  cost: number
): Activity {
  const activity = {
    id: Date.now().toString(),
    timestamp: new Date(),
    type,
    emoji,
    action,
    profileId,
    cost
  };
  
  return ActivitySchema.parse(activity);
}
