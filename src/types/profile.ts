import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  img: z.string(),
  distance: z.number().optional(),
  age: z.number().optional(),
  bio: z.string().optional(),
  isFollowing: z.boolean().default(false),
  online: z.boolean().default(false),
  x: z.number().optional(),
  y: z.number().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;

// Helper to validate profiles
export function validateProfile(data: unknown): Profile {
  return ProfileSchema.parse(data);
}

export function validateProfiles(data: unknown[]): Profile[] {
  return data.map(validateProfile);
}
