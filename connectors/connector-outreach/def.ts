import oas from '@opensdks/sdk-outreach/outreach.oas.json'
import type {ConnectorDef, ConnectorSchemas, OpenApiSpec} from '@usevenice/cdk'
import {connHelpers, oauthBaseSchema} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const zConfig = oauthBaseSchema.connectorConfig

const oReso = oauthBaseSchema.resourceSettings
export const zSettings = oReso.extend({
  oauth: oReso.shape.oauth,
})

export const outreachSchemas = {
  name: z.literal('outreach'),
  connectorConfig: zConfig,
  resourceSettings: zSettings,
  connectOutput: oauthBaseSchema.connectOutput,
} satisfies ConnectorSchemas

export const outreachHelpers = connHelpers(outreachSchemas)

export const outreachDef = {
  name: 'outreach',
  schemas: outreachSchemas,
  metadata: {
    displayName: 'Outreach',
    stage: 'beta',
    categories: ['sales-engagement'],
    logoUrl: '/_assets/logo-outreach.svg',
    nangoProvider: 'outreach',
    openapiSpec: {proxied: oas as unknown as OpenApiSpec},
  },
} satisfies ConnectorDef<typeof outreachSchemas>

export default outreachDef
