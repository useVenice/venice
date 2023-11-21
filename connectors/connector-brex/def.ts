import type {ConnectorDef, ConnectorSchemas} from '@usevenice/cdk'
import {connHelpers, zCcfgAuth} from '@usevenice/cdk'
import {z, zCast} from '@usevenice/util'

import type {components} from './__generated__/transactions.gen'

export const brexSchemas = {
  name: z.literal('brex'),
  connectorConfig: zCcfgAuth.oauthOrApikeyAuth,
  institutionData: z.unknown(),
  resourceSettings: z.object({
    accessToken: z.string(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<
        | components['schemas']['CardAccount']
        | components['schemas']['CashAccount']
      >(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<
        | components['schemas']['CardTransaction']
        | components['schemas']['CashTransaction']
      >(),
    }),
  ]),
} satisfies ConnectorSchemas

export const brexDef = {
  schemas: brexSchemas,
  name: 'brex',
  metadata: {
    categories: ['banking', 'expense-management'],
    logoUrl: '/_assets/logo-brex.png',
    stage: 'beta',
  },
  standardMappers: {
    institution: () => ({
      name: 'Brex',
      logoUrl: 'Add brex logo...',
      envName: undefined,
      categories: ['banking'],
    }),
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
    entity: {
      account: (entity) => ({
        id: entity.id,
        entityName: 'account',
        entity: {
          name: 'name' in entity.entity ? entity.entity.name : 'Brex Card',
        },
      }),
      // transaction: (entity) => ({
      //   id: entity.id,
      //   entityName: 'transaction',
      //   entity: {date: entity.entity.transaction_date},
      // }),
    },
  },
} satisfies ConnectorDef<typeof brexSchemas>

export const helpers = connHelpers(brexSchemas)

export default brexDef
