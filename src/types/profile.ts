import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  img: z.string().url(),
  balance: z.number().min(0),
  distance: z.string(),
  emoji: z.string().optional(),
  isFollowing: z.boolean().default(false),
  x: z.number().optional(),
  y: z.number().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ProximityProfileSchema = ProfileSchema.extend({
  x: z.number(),
  y: z.number()
});

export type ProximityProfile = z.infer<typeof ProximityProfileSchema>;
