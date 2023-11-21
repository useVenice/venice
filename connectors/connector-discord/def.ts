import type {ConnectorDef, ConnectorSchemas} from '@usevenice/cdk'
import {connHelpers, oauthBaseSchema} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const discordSchemas = {
  name: z.literal('discord'),
  connectorConfig: oauthBaseSchema.connectorConfig,
  resourceSettings: oauthBaseSchema.resourceSettings,
  connectOutput: oauthBaseSchema.connectOutput,
} satisfies ConnectorSchemas

export const discordHelpers = connHelpers(discordSchemas)

export const discordDef = {
  name: 'discord',
  schemas: discordSchemas,
  metadata: {
    displayName: 'Discord',
    stage: 'beta',
    logoUrl: '/_assets/logo-discord.svg',
    nangoProvider: 'discord',
  },
} satisfies ConnectorDef<typeof discordSchemas>

export default discordDef
