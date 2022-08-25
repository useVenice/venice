import { z } from 'zod';

export const WorkspaceUserWrite = z.object({
  user_id: z.string().uuid(),
  workspace_id: z.string(),
  role: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type WorkspaceUserWriteT = z.infer<typeof WorkspaceUserWrite>;
