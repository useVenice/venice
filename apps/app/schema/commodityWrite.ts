import { z } from 'zod';

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const CommodityWrite = z.object({
  id: z.string().optional(),
  provider_name: z.string().nullable().optional(),
  connection_id: z.string().nullable().optional(),
  standard: jsonSchema.optional(),
  external: jsonSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CommodityWriteT = z.infer<typeof CommodityWrite>;
