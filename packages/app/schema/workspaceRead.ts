import { z } from 'zod';

export const WorkspaceRead = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkspaceReadT = z.infer<typeof WorkspaceRead>;
