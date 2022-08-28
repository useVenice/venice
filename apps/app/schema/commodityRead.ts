import {z} from 'zod'

type Literal = boolean | null | number | string
type Json = Literal | {[key: string]: Json} | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
)

export const CommodityRead = z.object({
  id: z.string(),
  provider_name: z.string().nullable().optional(),
  connection_id: z.string().nullable().optional(),
  standard: jsonSchema,
  external: jsonSchema,
  created_at: z.string(),
  updated_at: z.string(),
})

export type CommodityReadT = z.infer<typeof CommodityRead>
