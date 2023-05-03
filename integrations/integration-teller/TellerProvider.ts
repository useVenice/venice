import type {SyncOperation} from '@usevenice/cdk-core'
import {makeSyncProvider, useScript} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import {A, parseMoney, R, Rx, rxjs, z} from '@usevenice/util'

import {
  accountTellerSchema,
  makeTellerClient,
  transactionItemSchema,
  zInstitution,
  zTellerConfig,
} from './TellerClient'

type TellerEntity = z.infer<(typeof def)['sourceOutputEntity']>
type TellerSyncOperation = SyncOperation<TellerEntity>

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('teller'),
  integrationConfig: zTellerConfig,
  resourceSettings: z.object({
    token: z.string(),
  }),
  institutionData: zInstitution,
  connectInput: z.object({
    applicationId: z.string(),
    userToken: z.string().nullish(),
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
    z.object({
      id: z.string(),
      entityName: z.literal('institution'),
      entity: zInstitution,
    }),
  ]),
})
const def = makeSyncProvider.def.helpers(_def)

export const tellerProvider = makeSyncProvider({
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-teller.svg'},
  ...veniceProviderBase(def, {
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
                accountExternalId: data.entity.account_id as ExternalId,
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
  standardMappers: {
    resource: (settings) => ({
      displayName: 'TODO' + settings.token,
      institutionId: 'ins_teller_TODO',
    }),
    institution: (data) => ({
      name: data.name,
      logoUrl: data.logoUrl,
      envName: undefined,
      loginUrl: undefined,
    }),
  },

  // eslint-disable-next-line @typescript-eslint/require-await
  preConnect: async (config) => ({
    userToken: '',
    applicationId: config.applicationId,
  }),
  useConnectHook: (_) => {
    const loaded = useScript('//cdn.teller.io/connect/connect.js')
    return async (opts, {institutionExternalId}) => {
      await loaded
      const institution = institutionExternalId
        ? `${institutionExternalId}`
        : undefined
      return new Promise((resolve, reject) => {
        const tellerConnect = window.TellerConnect.setup({
          applicationId: opts.applicationId,
          ...(institution && {institution}),
          onInit() {
            console.log('Teller Connect has initialized')
          },
          // Part 3. Handle a successful enrollment's accessToken
          onSuccess(enrollment) {
            console.log('User enrolled successfully', enrollment)
            resolve({token: enrollment.accessToken})
          },
          onFailure(failure) {
            console.error('User enrolled failed', failure)
            reject(new Error(failure.message))
          },
          onExit() {
            console.log('User closed Teller Connect')
          },
        })
        tellerConnect.open()
      })
    }
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  postConnect: async (input, _config) => ({
    resourceExternalId: input.token, // FIXME
    settings: {token: input.token},
    // institution // FIXME
  }),
  sourceSync: ({settings, config}) => {
    const client = makeTellerClient({...config, token: settings.token})
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

  metaSync: ({config}) => {
    console.log('metaZSync teller', config)
    return rxjs
      .from(makeTellerClient(config).getInstitutions())
      .pipe(Rx.map((ins) => def._insOpData(ins.id, ins)))
  },
})

const _op: typeof R.identity<TellerSyncOperation> = R.identity
