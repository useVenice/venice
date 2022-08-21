import { z } from 'zod';

export const MigrationsRead = z.object({
  name: z.string(),
  hash: z.string(),
  date: z.string(),
});

export type MigrationsReadT = z.infer<typeof MigrationsRead>;
