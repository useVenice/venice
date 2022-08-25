import { z } from 'zod';

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const IntegrationWrite = z.object({
  id: z.string().optional(),
  workspace_id: z.string(),
  config: jsonSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type IntegrationWriteT = z.infer<typeof IntegrationWrite>;
