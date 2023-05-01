/** Used for the side effect of window.MergeLink */
import type {IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'
import {defHelpers} from '@usevenice/cdk-core'
import {Rx, rxjs, z, zCast} from '@usevenice/util'

import type {components} from './__generated__/transactions.gen'
import {makeBrexClient} from './BrexClient'

// TODO: Split into 3 files... Def aka common / Client / Server

export const brexDef = {
  name: z.literal('brex'),
  integrationConfig: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
  }),
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
} satisfies IntegrationDef

const helpers = defHelpers(brexDef)

export const brexImpl = {
  def: brexDef,
  name: 'brex',
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-brex.png'},
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
  },
  extension: {
    sourceMapEntity: {
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

  sourceSync: ({settings}) => {
    const client = makeBrexClient({
      accessToken: settings.accessToken,
    })

    // TODO: Paginate obviously
    return rxjs
      .from(
        client.transactions
          .get('/v2/transactions/card/primary', {})
          .then((res) =>
            (res.items ?? [])?.map((txn) =>
              helpers._opData('transaction', txn.id ?? '', txn),
            ),
          ),
      )
      .pipe(Rx.mergeMap((ops) => rxjs.from(ops)))
  },
} satisfies IntegrationImpl<typeof brexDef>
