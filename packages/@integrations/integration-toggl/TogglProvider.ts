import {
  itemProjectResponseSchema,
  itemTimeEntriesSchema,
  makeTogglClient,
} from './TogglCient'
import {makeSyncProvider} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {A, Deferred, identity, Rx, rxjs, z} from '@ledger-sync/util'
import React from 'react'

type TogglSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('toggl'),
  // integrationConfig: zTogglConfig,
  preConnectInput: z.object({
    apiToken: z.string(),
  }),
  connectInput: z.object({
    apiToken: z.string(),
  }),
  connectOutput: z.object({
    apiToken: z.string(),
    email: z.string().nullish(),
    password: z.string().nullish(),
  }),
  connectionSettings: z.object({
    apiToken: z.string(),
    email: z.string().nullish(),
    password: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: itemProjectResponseSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: itemTimeEntriesSchema,
    }),
  ]),
})

export const togglProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: `${a.id}`,
          entityName: 'account',
          entity: identity<Standard.Account>({
            name: data.entity.name ?? '',
            type: 'expense',
          }),
        }
      } else if (data.entityName === 'transaction') {
        const t = data.entity
        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: identity<Standard.Transaction>({
            date: data.entity.at ?? '',
            description: data.entity.description ?? '',
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: `${data.entity.workspace_id}` as Id.external,
                amount: A(data.entity.duration ?? 0, 'Second' as Unit),
              },
            }),
          }),
        }
      }
      return null
    },
  }),

  useConnectHook: (_type) => {
    const [isShowPromt, setIsShowPromt] = React.useState(false)

    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )

    React.useEffect(() => {
      if (isShowPromt) {
        const email = window.prompt('Input Your Email')
        const password = window.prompt('Input Your Password')
        const apiToken =
          !email || !password ? window.prompt('...or input Your API Token') : ''
        deferred.resolve({email, password, apiToken: apiToken ?? ''})
        setIsShowPromt(false)
      }
    }, [isShowPromt, deferred])

    return (_opts) => {
      setIsShowPromt(true)
      return deferred.promise
    }
  },

  postConnect: async (input) => {
    const settings = identity<z.infer<typeof def['connectionSettings']>>({
      apiToken: input.apiToken,
      email: input.email,
      password: input.password,
    })
    const source$: rxjs.Observable<TogglSyncOperation> =
      togglProvider.sourceSync({settings, options: {}})

    return {
      externalId: input.apiToken,
      settings,
      source$,
    }
  },

  sourceSync: ({settings: input}) => {
    const client = makeTogglClient({...input})
    async function* iterateEntities() {
      const user = await client.getMe()
      const res = await client.getProjects(`${user.default_workspace_id}`)
      yield res.map((a) =>
        _op({
          type: 'data',
          data: {id: `${a.id}`, entity: a, entityName: 'account'},
        }),
      )

      // TODO: Need to pass params if necessary
      const res2 = await client.getTimeEntries()
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

const _op: typeof identity<TogglSyncOperation> = identity
