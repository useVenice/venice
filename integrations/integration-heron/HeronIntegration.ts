import type {IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'

import {rxjs, z} from '@usevenice/util'
import {makeHeronClient} from './HeronClient'

export const heronDef = {
  name: z.literal('heron'),
  integrationConfig: z.object({
    apiKey: z.string(),
  }),
  resourceSettings: z.object({
    accountToken: z.string(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
    }),
  ]),
} satisfies IntegrationDef

// const helpers = defHelpers(heronDef)

export const heronImpl = {
  def: heronDef,
  name: 'heron',

  standardMappers: {
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },
  extension: {
    sourceMapEntity: {
      // account: (entity) => ({
      //   id: entity.id,
      //   entityName: 'account',
      //   entity: {name: entity.entity.name ?? ''},
      // }),
      // transaction: (entity) => ({
      //   id: entity.id,
      //   entityName: 'transaction',
      //   entity: {date: entity.entity.transaction_date},
      // }),
    },
  },

  sourceSync: ({config}) => {
    // @ts-expect-error
    const client = makeHeronClient({
      apiKey: config.apiKey,
    })

    return rxjs.EMPTY
  },
} satisfies IntegrationImpl<typeof heronDef>
