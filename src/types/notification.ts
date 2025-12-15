import { z } from 'zod';

export const NotificationTypeEnum = z.enum(['success', 'error', 'info', 'warning', 'action']);

export const NotificationProfileSchema = z.object({
  image: z.string(),
  name: z.string()
});

export const NotificationActionSchema = z.object({
  label: z.string(),
  handler: z.function().args().returns(z.void())
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeEnum,
  message: z.string(),
  duration: z.number().default(3000),
  icon: z.string().optional(),
  profile: NotificationProfileSchema.optional().nullable(),
  action: NotificationActionSchema.optional()
});

export type NotificationType = z.infer<typeof NotificationTypeEnum>;
export type NotificationProfile = z.infer<typeof NotificationProfileSchema>;
export type NotificationAction = z.infer<typeof NotificationActionSchema>;
export type Notification = z.infer<typeof NotificationSchema>;

// For creating notifications (without id, has defaults)
export type NotificationInput = Omit<Notification, 'id' | 'duration'> & {
  duration?: number;
};
