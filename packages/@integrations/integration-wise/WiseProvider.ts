import {
  makeWiseClient,
  profileResponseItemSchema,
  transferResponseItemSchema,
  zEnvName,
} from './WiseClient'
import {makeSyncProvider} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {A, Deferred, identity, Rx, rxjs, z} from '@ledger-sync/util'
import React from 'react'

type WiseSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('wise'),
  // integrationConfig: zWiseConfig,
  connectionSettings: z.object({
    envName: zEnvName,
    apiToken: z.string().nullish(),
  }),
  preConnectInput: z.object({
    envName: zEnvName,
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
  ...ledgerSyncProviderBase(def, {
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
                accountExternalId: (data.entity.quoteUuid ?? '') as Id.external,
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
  getPreConnectInputs: (_type) =>
    zEnvName.options.map((envName) =>
      def._preConnOption({
        key: envName,
        label: envName,
        options: {envName},
      }),
    ),
  // preConnect: ({envName, ...input}) =>
  //   Promise.resolve({
  //     envName,
  //     ...input
  //   }),

  useConnectHook: (_type) => {
    const [options, setOptions] = React.useState<z.infer<
      typeof def['connectInput']
    > | null>(null)

    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )

    React.useEffect(() => {
      if (options?.envName) {
        // Will use it once we know the clientId either for sandbox or live environment, https://sandbox.transferwise.tech/settings/ (we only know the api key as access token)
        // window.open(
        //   `https://sandbox.transferwise.tech/oauth/authorize/?client_id=${options.clientId}&redirect_uri=${options.redirectUri}`,
        // )
        const apiToken = window.prompt('Input Your Wise Api Token', '')
        deferred.resolve({...options, envName: options.envName, apiToken})
      }
    }, [options, deferred])

    return (opts) => {
      setOptions({
        ...opts,
        envName: opts.envName,
      })
      return deferred.promise
    }
  },

  postConnect: async (input) => {
    const settings = identity<z.infer<typeof def['connectionSettings']>>({
      envName: input.envName ?? '',
      apiToken: input.apiToken,
    })
    const source$: rxjs.Observable<WiseSyncOperation> = wiseProvider.sourceSync(
      {settings, options: {}},
    )
    return {
      externalId: input.apiToken ?? '',
      settings,
      source$,
    }
  },
  sourceSync: ({settings: conn}) => {
    const client = makeWiseClient({...conn})
    async function* iterateEntities() {
      const res = await client.getProfiles(conn.envName)
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
              envName: conn.envName,
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

const _op: typeof identity<WiseSyncOperation> = identity
