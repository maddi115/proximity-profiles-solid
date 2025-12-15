import { z } from 'zod';

export const UserStatsSchema = z.object({
  pulsesSent: z.number().default(0),
  revealsReceived: z.number().default(0),
  slapsGiven: z.number().default(0),
  following: z.number().default(0),
  followers: z.number().default(0)
});

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  bio: z.string(),
  avatar: z.string().url(),
  email: z.string().email(),
  balance: z.number().default(100),
  stats: UserStatsSchema,
  joinedDate: z.date()
});

export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

// Partial updates
export type UserProfileUpdate = Partial<Omit<UserProfile, 'stats' | 'joinedDate'>>;
