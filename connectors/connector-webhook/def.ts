import type {
  AnyEntityPayload,
  ConnectorDef,
  ConnectorSchemas,
} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {z, zCast} from '@usevenice/util'

export const webhookSchemas = {
  name: z.literal('webhook'),
  resourceSettings: z.object({
    destinationUrl: z.string(),
  }),
  destinationInputEntity: zCast<AnyEntityPayload>(),
} satisfies ConnectorSchemas

export const webhookHelpers = connHelpers(webhookSchemas)

export const webhookDef = {
  name: 'webhook',
  metadata: {categories: ['streaming'], logoUrl: '/_assets/logo-webhook.png'},

  schemas: webhookSchemas,
} satisfies ConnectorDef<typeof webhookSchemas>

export default webhookDef
