import { z } from 'zod';

export const ProximityHitSchema = z.object({
  profileId: z.string(),
  distance: z.number(),
  timestamp: z.date()
});

export const ProximityHistoryEntrySchema = z.object({
  profileId: z.string(),
  firstSeen: z.date(),
  lastSeen: z.date(),
  closestDistance: z.number(),
  encounters: z.number()
});

export type ProximityHit = z.infer<typeof ProximityHitSchema>;
export type ProximityHistoryEntry = z.infer<typeof ProximityHistoryEntrySchema>;
