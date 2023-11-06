import type {
  AnyEntityPayload,
  IntegrationDef,
  IntegrationSchemas,
} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import {z, zCast} from '@usevenice/util'

export const webhookSchemas = {
  name: z.literal('webhook'),
  resourceSettings: z.object({
    destinationUrl: z.string(),
  }),
  destinationInputEntity: zCast<AnyEntityPayload>(),
} satisfies IntegrationSchemas

export const webhookHelpers = intHelpers(webhookSchemas)

export const webhookDef = {
  name: 'webhook',
  metadata: {categories: ['streaming'], logoUrl: '/_assets/logo-webhook.png'},

  schemas: webhookSchemas,
} satisfies IntegrationDef<typeof webhookSchemas>

export default webhookDef
