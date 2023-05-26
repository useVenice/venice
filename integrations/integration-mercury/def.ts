/**
 * For documentation, @see https://docs.mercury.com/reference/accounts
 * https://share.cleanshot.com/QjmQTFf9
 */
import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers, zIntAuth} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

export const mercurySchemas = {
  name: z.literal('mercury'),
  integrationConfig: zIntAuth.oauthOrApikeyAuth,
} satisfies IntegrationSchemas

export const mercuryDef = {
  def: mercurySchemas,
  name: 'mercury',
  metadata: {
    categories: ['banking'],
    logoUrl: '/_assets/logo-mercury.png',
    stage: 'alpha',
  },
  standardMappers: {
    institution: () => ({
      name: 'Mercury',
      logoUrl: 'TODO: Default to integration metadata logoUrl',
      categories: ['banking'],
    }),
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },
} satisfies IntegrationDef<typeof mercurySchemas>

export const helpers = intHelpers(mercurySchemas)

export default mercuryDef
