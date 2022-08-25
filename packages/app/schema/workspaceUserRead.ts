import { z } from 'zod';

export const WorkspaceUserRead = z.object({
  user_id: z.string().uuid(),
  workspace_id: z.string(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkspaceUserReadT = z.infer<typeof WorkspaceUserRead>;
