export const IslandModes = {
  COMPACT: 'compact',
  PROXIMITY: 'proximity',
  NOTIFICATION: 'notification'
} as const;

export type IslandMode = typeof IslandModes[keyof typeof IslandModes];
