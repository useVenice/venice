import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import type {EntityPayload} from '@usevenice/cdk-ledger'
import {z, zCast} from '@usevenice/util'

import type {components} from './heron.gen'

export const heronSchemas = {
  name: z.literal('heron'),
  integrationConfig: z.object({apiKey: z.string()}),
  // is endUserId actually needed here?
  // How do we create default resources for integrations that are basically single resource?
  destinationInputEntity: zCast<EntityPayload>(),
  sourceOutputEntity: z.object({
    id: z.string(),
    entityName: z.literal('transaction'),
    entity: zCast<components['schemas']['TransactionEnriched']>(),
  }),
} satisfies IntegrationSchemas

export const helpers = intHelpers(heronSchemas)

export const heronDef = {
  schemas: heronSchemas,
  name: 'heron',
  metadata: {
    displayName: 'Heron Data',
    stage: 'beta',
    categories: ['enrichment'],
    // This reaches into the next.js public folder which is technically outside the integration directory itself.
    // Low priority to figure out how to have the svg assets be self-contained also
    // also we may need mdx support for the description etc.
    logoUrl: '/_assets/logo-heron.png',
  },

  standardMappers: {
    resource() {
      return {
        displayName: 'Heron',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },
  extension: {
    sourceMapEntity: {
      transaction: (entity) => ({
        id: entity.id,
        entityName: 'transaction',
        entity: {
          date: entity.entity.date ?? '',
          description: entity.entity.description ?? '',
        },
      }),
    },
  },
} satisfies IntegrationDef<typeof heronSchemas>

export default heronDef
