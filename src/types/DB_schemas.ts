import { z } from 'zod';

/**
 * 🍄 DATABASE SCHEMAS
 * 
 * All database operations MUST validate against these schemas.
 * Provides runtime validation + TypeScript types.
 * 
 * Tree:
 * 🍄 AUTH Schemas
 *  ├─ signUp      -> email, password, optional metadata
 *  ├─ signIn      -> email, password
 *  └─ oauth       -> provider, redirectTo
 * 
 * 🍄 READ Schemas
 *  └─ session     -> user, tokens
 * 
 * 🍄 WRITE Schemas
 *  └─ profile     -> username, bio
 */

// 🍄 AUTH: User authentication schemas
export const DB_AuthSchemas = {
  signUp: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password too long"),
    metadata: z.object({
      username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username too long")
    }).optional()
  }),

  signIn: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password required")
  }),

  oauth: z.object({
    provider: z.enum(['google', 'github'], {
      errorMap: () => ({ message: "Provider must be 'google' or 'github'" })
    }),
    redirectTo: z.string().url("Invalid redirect URL")
  })
};

// 🍄 READ: Session data schema
export const DB_SessionSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    user_metadata: z.record(z.any())
  }),
  access_token: z.string(),
  refresh_token: z.string()
});

// 🍄 WRITE: Profile data schema
export const DB_ProfileSchema = z.object({
  username: z.string().min(3).max(20),
  bio: z.string().max(160, "Bio too long").optional()
});

// Export types for TypeScript
export type SignUpInput = z.infer<typeof DB_AuthSchemas.signUp>;
export type SignInInput = z.infer<typeof DB_AuthSchemas.signIn>;
export type OAuthInput = z.infer<typeof DB_AuthSchemas.oauth>;
export type SessionData = z.infer<typeof DB_SessionSchema>;
export type ProfileData = z.infer<typeof DB_ProfileSchema>;
