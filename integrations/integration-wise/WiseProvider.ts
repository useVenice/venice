import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import {A, R, Rx, rxjs, z} from '@usevenice/util'

import {
  makeWiseClient,
  profileResponseItemSchema,
  transferResponseItemSchema,
  zEnvName,
} from './WiseClient'

type WiseSyncOperation = (typeof def)['_opType']

const def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('wise'),
  // integrationConfig: zWiseConfig,
  resourceSettings: z.object({
    envName: zEnvName,
    apiToken: z.string().nullish(),
  }),
  connectInput: z.object({
    redirectUri: z.string(),
    clientId: z.string(),
    envName: zEnvName,
  }),
  connectOutput: z.object({
    envName: zEnvName,
    apiToken: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: profileResponseItemSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transferResponseItemSchema,
    }),
  ]),
})

export const wiseProvider = makeSyncProvider({
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-wise.png'},
  ...veniceProviderBase(def, {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: `${a.id}`,
          entityName: 'account',
          entity: {
            name: `${data.entity.details.firstName} ${data.entity.details.lastName}`,
            type: 'expense',
          },
        }
      } else if (data.entityName === 'transaction') {
        const t = data.entity

        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: {
            date: t.created,
            description: t.details.reference ?? '',
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: (data.entity.quoteUuid ?? '') as ExternalId,
                amount: A(
                  data.entity.sourceValue ?? 0,
                  (data.entity.sourceCurrency ?? 'USD') as Unit,
                ),
              },
            }),
          },
        }
      }
      return null
    },
  }),

  postConnect: (input) => ({
    resourceExternalId: input.apiToken ?? '',
    settings: {
      envName: input.envName ?? '',
      apiToken: input.apiToken,
    },
  }),
  sourceSync: ({settings}) => {
    const client = makeWiseClient({...settings})
    async function* iterateEntities() {
      const res = await client.getProfiles(settings.envName)
      yield res.map((a) =>
        _op({
          type: 'data',
          data: {id: `${a.id}`, entity: a, entityName: 'account'},
        }),
      )

      const combineRes = await Promise.all(
        res.map(
          async (a: z.infer<typeof profileResponseItemSchema>) =>
            await client.getTransfers({
              envName: settings.envName,
              profileId: a.id,
            }),
        ),
      )
      // TODO: Need to check is it better than use the  basic promise all
      // const res2 = await rxjs.firstValueFrom(
      //   rxjs
      //     .from(res)
      //     .pipe(
      //       rxjs.mergeMap( (el: z.infer<typeof profileResponseItemSchema>) =>
      //         rxjs.from(client.getTransfers({envName: input.envName, profileId: el.id}),)
      //       ),
      //       rxjs.toArray()
      //     ),
      // )
      const res2 = combineRes.flat(1)

      yield res2.map((t) =>
        _op({
          type: 'data',
          data: {id: `${t.id}`, entity: t, entityName: 'transaction'},
        }),
      )
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, _op({type: 'commit'})])))
  },
})

const _op: typeof R.identity<WiseSyncOperation> = R.identity
