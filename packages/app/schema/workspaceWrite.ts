import { z } from 'zod';

export const WorkspaceWrite = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type WorkspaceWriteT = z.infer<typeof WorkspaceWrite>;
