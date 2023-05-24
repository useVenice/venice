import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import {A, R, Rx, rxjs, z} from '@usevenice/util'

import {
  itemProjectResponseSchema,
  itemTimeEntriesSchema,
  makeTogglClient,
} from './TogglCient'

type TogglSyncOperation = (typeof def)['_opType']

const def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('toggl'),
  // integrationConfig: zTogglConfig,
  connectInput: z.object({
    apiToken: z.string(),
  }),
  connectOutput: z.object({
    apiToken: z.string(),
    email: z.string().nullish(),
    password: z.string().nullish(),
  }),
  resourceSettings: z.object({
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
  ...veniceProviderBase(def, {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: `${a.id}`,
          entityName: 'account',
          entity: R.identity<Standard.Account>({
            name: data.entity.name ?? '',
            type: 'expense',
          }),
        }
      } else if (data.entityName === 'transaction') {
        const t = data.entity
        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: R.identity<Standard.Transaction>({
            date: data.entity.at ?? '',
            description: data.entity.description ?? '',
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: `${data.entity.workspace_id}` as ExternalId,
                amount: A(data.entity.duration ?? 0, 'Second' as Unit),
              },
            }),
          }),
        }
      }
      return null
    },
  }),

  postConnect: (input) => ({
    resourceExternalId: input.apiToken,
    settings: {
      apiToken: input.apiToken,
      email: input.email,
      password: input.password,
    },
    triggerDefaultSync: true,
  }),

  sourceSync: ({settings}) => {
    const client = makeTogglClient({...settings})
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

const _op: typeof R.identity<TogglSyncOperation> = R.identity
