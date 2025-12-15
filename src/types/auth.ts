import { z } from 'zod';
import type { User, Session } from '@supabase/supabase-js';

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  user: z.any().optional()
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const OAuthProviderSchema = z.enum(['google', 'github', 'discord']);
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

export interface UserMetadata {
  username?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface ProfileUpdate {
  username?: string;
  avatar_url?: string;
  [key: string]: any;
}

export type { User, Session };
