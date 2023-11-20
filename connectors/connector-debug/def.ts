import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers, zWebhookInput} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const debugSchemas = {
  name: z.literal('debug'),
  webhookInput: zWebhookInput,
  resourceSettings: z.unknown(),
  integrationConfig: z.unknown(),
  sourceOutputEntity: z.unknown(),
  institutionData: z.unknown(),
} satisfies IntegrationSchemas

export const helpers = intHelpers(debugSchemas)

export const debugDef = {
  metadata: {stage: 'hidden'},
  name: 'debug',
  schemas: debugSchemas,
} satisfies IntegrationDef<typeof debugSchemas>

export default debugDef
