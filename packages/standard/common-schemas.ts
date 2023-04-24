import {z, zCast} from '@usevenice/util'

type MergeSchemas =
  import('../../integrations/integration-merge/merge.accounting.gen').components['schemas']

export const Invoice = zCast<MergeSchemas['Invoice']>()

/** Either customer or Vendor */
export const Contact = zCast<MergeSchemas['Contact']>()

// TODO: rename to stream and data
/** Aka Airbyte Record */
export const Entity = z.discriminatedUnion('entityName', [
  z.object({entityName: z.literal('invoice'), entity: Invoice, id: z.string()}),
  z.object({entityName: z.literal('contact'), entity: Contact, id: z.string()}),
])
