import {z} from 'zod'

export const MigrationsWrite = z.object({
  name: z.string(),
  hash: z.string(),
  date: z.string().optional(),
})

export type MigrationsWriteT = z.infer<typeof MigrationsWrite>
