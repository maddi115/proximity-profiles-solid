import { z } from 'zod';

export const ThemeSchema = z.enum(['dark', 'light']);
export type Theme = z.infer<typeof ThemeSchema>;

export const NotificationSettingsSchema = z.object({
  pulse: z.boolean(),
  reveal: z.boolean(),
  slap: z.boolean(),
  follow: z.boolean(),
  sound: z.boolean()
});

export const PrivacySettingsSchema = z.object({
  showLocation: z.boolean(),
  allowPulses: z.boolean(),
  allowReveals: z.boolean()
});

export const AccountSettingsSchema = z.object({
  email: z.string().email(),
  emailVerified: z.boolean()
});

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type AccountSettings = z.infer<typeof AccountSettingsSchema>;
