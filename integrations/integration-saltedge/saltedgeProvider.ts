import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import type {Brand} from '@usevenice/util'
import {
  A,
  DateTime,
  objectFromObject,
  R,
  Rx,
  rxjs,
  startCase,
  z,
  zCast,
} from '@usevenice/util'

import {
  CACHED_CATEGORIES_MAP,
  makeSaltedgeClient,
  zConfig,
} from './saltedgeClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('saltedge'),
  integrationConfig: zConfig,
  resourceSettings: zCast<SaltEdge.Connection & {_id: ExternalId}>(),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<
        {
          _balancesMap: Record<
            ISODate,
            Pick<SaltEdge.Account, 'balance' | 'currency_code'>
          >
        } & SaltEdge.Account
      >(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<SaltEdge.Transaction>(),
    }),
  ]),
})

export const saltedgeProviderDef = makeSyncProvider.def.helpers(_def)

export const saltedgeProvider = makeSyncProvider({
  ...veniceProviderBase(saltedgeProviderDef, {
    sourceMapEntity: {
      account: ({entity: a}, c) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          // This works well for TransferWise (Personal access token)
          // (It names accounts as something like 123457678 MXN, not helpful)
          // which is the main institution we want
          // SaltEdge for. Let's revisit if this causes issue for anyone else.
          name: `${c.provider_name} - ${a.name}`,
          informationalBalances: {
            current: A(a.balance, a.currency_code),
          },
          defaultUnit: a.currency_code as Unit,
          balancesMap: objectFromObject(
            a._balancesMap ?? {},
            (_, val): Standard.Balance => ({
              autoShiftPaddingDate: true,
              holdings: [A(val.balance, val.currency_code)],
              disabled: true,
            }),
          ),
          type: ((): Standard.AccountType => {
            switch (a.nature) {
              case 'account':
                return 'asset'
              case 'savings':
              case 'card':
              case 'checking':
              case 'debit_card':
                return 'asset/bank'
              case 'ewallet':
                return 'asset/digital_wallet'
              case 'bonus':
                return 'asset/rewards'
              case 'insurance':
                return 'asset/brokerage'
              case 'investment':
                return 'asset/brokerage'
              case 'mortgage':
                return 'liability/mortgage'
              case 'credit':
                return 'liability'
              case 'credit_card':
                return 'liability/credit_card'
              case 'loan':
                return 'liability/personal_loan'
              default:
                return 'asset'
            }
          })(),
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: t.made_on,
          payee: t.extra.payee,
          description: t.description,
          externalCategory:
            CACHED_CATEGORIES_MAP.personal[t.category] ?? startCase(t.category),
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.account_id as ExternalId,
              amount: A(t.amount, t.currency_code),
            },
          }),
          externalStatus: t.status as Brand<string, 'externalStatus'>,
          custom: {possible_duplicate: true},
        },
      }),
    },
  }),

  sourceSync: ({config, settings}) => {
    const saltedge = makeSaltedgeClient(config)
    async function* iterateEntities() {
      for await (const accounts of saltedge.iterateAllAccounts({
        connection_id: settings._id,
      })) {
        yield accounts.map((a) =>
          saltedgeProviderDef._opData('account', a.id, {
            ...a,
            _balancesMap: {
              [DateTime.utc().toISODate()]: R.pick(a, [
                'balance',
                'currency_code',
              ]),
            },
          }),
        )
      }

      const txnGenerator = saltedge.iterateAllTransactions({
        connection_id: settings._id,
      }) // TODO: Complete txnGenerator conditials

      for await (const transactions of txnGenerator) {
        yield transactions.map((t) =>
          saltedgeProviderDef._opData('transaction', t.id, t),
        )
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, saltedgeProviderDef._op('commit')]),
        ),
      )

    // TODO: Move handlePushData
  },
})
