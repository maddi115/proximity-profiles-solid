import { z } from 'zod';

export const LoadingOperationSchema = z.object({
  isLoading: z.boolean(),
  startTime: z.date()
});

export type LoadingOperation = z.infer<typeof LoadingOperationSchema>;

export type LoadingOperations = Record<string, LoadingOperation>;
