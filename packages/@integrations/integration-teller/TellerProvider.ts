import {makeSyncProvider, SyncOperation} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {A, Deferred, identity, parseMoney, Rx, rxjs, z} from '@ledger-sync/util'
import React from 'react'
import {HandleSuccessTellerEnrollment, useTellerAPI} from './teller-utils'
import {
  accountTellerSchema,
  makeTellerClient,
  transactionItemSchema,
  zEnvName,
  zTellerConfig,
} from './TellerClient'

type TellerEntity = z.infer<typeof def['sourceOutputEntity']>
type TellerSyncOperation = SyncOperation<TellerEntity>

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('teller'),
  integrationConfig: zTellerConfig,
  connectionSettings: z.object({
    token: z.string(),
  }),
  preConnectInput: z.object({
    userToken: z.string(),
    envName: zEnvName,
    applicationId: z.string(),
  }),
  connectInput: z.object({
    userToken: z.string().nullish(),
    applicationId: z.string().nullish(),
    envName: zEnvName,
  }),
  connectOutput: z.object({
    token: z.string(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: accountTellerSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transactionItemSchema,
    }),
  ]),
})

export const tellerProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: a.id,
          entityName: 'account',
          entity: {
            name: a.name,
            lastFour: a.last_four,
            type: 'asset/bank',
            institutionName: a.institution.name,
            informationalBalances: {
              current: null,
              available: A(
                parseMoney(data.entity.balance?.available ?? ''),
                data.entity.currency as Unit,
              ),
              limit: null,
            },
            defaultUnit: a.currency as Unit,
          },
        }
      }
      if (data.entityName === 'transaction') {
        const t = data.entity
        return {
          id: t.id,
          entityName: 'transaction',
          entity: {
            date: t.date,
            description: data.entity.description,
            externalCategory: data.entity.details.category,
            payee: data.entity.details.counterparty.name,
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: data.entity.account_id as Id.external,
                // TODO: Need to store `accounts` within `connection` so that
                // we can look up the proper currency as transactions themselves
                // do not contain currency.

                // TODO: Need to better understand the rules around how teller signs amounts
                // For credit cards, it appears to use positive to indicate expense https://share.cleanshot.com/TsfvXL
                // but what about for bank accounts and others?
                amount: A(-1 * parseMoney(data.entity.amount), 'USD' as Unit),
              },
            }),
          },
        }
      }
      // TODO: Map transactions
      return null
    },
  }),
  getPreConnectInputs: ({envName, ledgerId}) => [
    def._preConnOption({
      key: envName,
      label: envName,
      options: {envName, userToken: ledgerId, applicationId: ''},
    }),
  ],
  preConnect: ({envName}, config) =>
    Promise.resolve({
      userToken: config.token,
      applicationId: config.applicationId,
      envName,
    }),
  useConnectHook: (_type) => {
    const [options, setOptions] = React.useState<
      | (z.infer<typeof zTellerConfig> & {
          environment: z.infer<typeof zEnvName>
        })
      | null
    >(null)
    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )
    const tellerConnect = useTellerAPI({
      environment: options?.environment,
      applicationId: null,
      ...options,
      onInit: () => {
        console.log('Teller Connect has initialized')
      },
      // Part 3. Handle a successful enrollment's accessToken
      onSuccess: (enrollment: HandleSuccessTellerEnrollment) => {
        console.log('User enrolled successfully', enrollment.accessToken)
        deferred.resolve({token: enrollment.accessToken ?? ''})
      },
      onExit: () => {
        console.log('User closed Teller Connect')
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).TellerConnect = tellerConnect
    React.useEffect(() => {
      if (options?.applicationId) {
        tellerConnect?.open()
      }
    }, [options?.applicationId, tellerConnect])

    return (opts) => {
      setOptions({
        applicationId: opts.applicationId,
        environment: opts.envName,
      })
      return deferred.promise
    }
  },

  postConnect: async (input, config) => {
    const settings = identity<z.infer<typeof def['connectionSettings']>>({
      token: input.token,
    })
    const source$: rxjs.Observable<TellerSyncOperation> =
      tellerProvider.sourceSync({settings, config, options: {}})
    return {
      connectionId: `conn_teller_${input.token}`,
      settings,
      source$,
    }
  },
  sourceSync: ({settings: input, config}) => {
    const client = makeTellerClient({...config, token: input.token})
    async function* iterateEntities() {
      const res = await client.getAccounts(undefined)
      const combineRes = await Promise.all(
        res.map(async (a: z.infer<typeof accountTellerSchema>) => ({
          ...a,
          balance: await client.getAccountBalances({id: a.id}),
        })),
      )
      yield combineRes.map((a: z.infer<typeof accountTellerSchema>) =>
        _op({type: 'data', data: {id: a.id, entity: a, entityName: 'account'}}),
      )

      const combineRes2 = await Promise.all(
        res.map(
          async (a: z.infer<typeof accountTellerSchema>) =>
            await client.getTransactions({
              id: a.id,
            }),
        ),
      )
      const res2 = combineRes2.flat(1)
      yield res2.map((t: z.infer<typeof transactionItemSchema>) =>
        _op({
          type: 'data',
          data: {id: t.id, entity: t, entityName: 'transaction'},
        }),
      )
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, _op({type: 'commit'})])))
  },
})

const _op: typeof identity<TellerSyncOperation> = identity
