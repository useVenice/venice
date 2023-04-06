import {defHelpers, IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'

import {Rx, rxjs, z} from '@usevenice/util'
import {makeMergeClient} from './MergeClient'

// TODO: Split into 3 files... Def aka common / Client / Server

export const mergeDef = {
  name: z.literal('merge'),
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
      entity: z.object({}),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: z.object({}),
    }),
  ]),
} satisfies IntegrationDef

const helpers = defHelpers(mergeDef)

export const mergeImpl = {
  def: mergeDef,
  sourceSync: ({config, settings}) => {
    const client = makeMergeClient({
      apiKey: config.apiKey,
      accountToken: settings.accountToken,
    })

    return rxjs
      .from(
        client.accounting
          .get('/accounts', {})
          .then((res) =>
            (res.results ?? [])?.map((acct) =>
              helpers._opData('account', acct.id ?? '', acct),
            ),
          ),
      )
      .pipe(Rx.mergeMap((ops) => rxjs.from(ops)))
  },
} satisfies IntegrationImpl<typeof mergeDef>
