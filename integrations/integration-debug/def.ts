import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers, zWebhookInput} from '@usevenice/cdk-core'
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
  def: debugSchemas,
  // Temporary hack to workaround assertion in mapStandardEntityLink when using debugProvider
  // as a source. However we should do something so this workaround is not needed in the first place
  extension: {sourceMapEntity: {}},
} satisfies IntegrationDef<typeof debugSchemas>

export default debugDef
