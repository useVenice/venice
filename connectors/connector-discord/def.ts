import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers, oauthBaseSchema} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const discordSchemas = {
  name: z.literal('discord'),
  integrationConfig: oauthBaseSchema.integrationConfig,
  resourceSettings: oauthBaseSchema.resourceSettings,
  connectOutput: oauthBaseSchema.connectOutput,
} satisfies IntegrationSchemas

export const discordHelpers = intHelpers(discordSchemas)

export const discordDef = {
  name: 'discord',
  schemas: discordSchemas,
  metadata: {
    displayName: 'Discord',
    stage: 'beta',
    logoUrl: '/_assets/logo-discord.svg',
    nangoProvider: 'discord',
  },
} satisfies IntegrationDef<typeof discordSchemas>

export default discordDef
