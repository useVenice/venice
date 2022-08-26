import { z } from 'zod';

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const ConnectionWrite = z.object({
  id: z.string().optional(),
  ledger_id: z.string(),
  integration_id: z.string().nullable().optional(),
  settings: jsonSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type ConnectionWriteT = z.infer<typeof ConnectionWrite>;
