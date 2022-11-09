import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import {A, objectFromArray, Rx, rxjs, z, zCast} from '@usevenice/util'

import {makeMootaClient, zConfig} from './mootaClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('moota'),
  integrationConfig: zConfig,
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<Moota.BankAccount>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<Moota.Transaction>(),
    }),
  ]),
})

export const mootaProviderDef = makeSyncProvider.def.helpers(_def)

function toISO(mootaDate: string) {
  // Local timezone
  return mootaDate.replace(' ', 'T') + '+07:00' // Always Jakarta time
}

export const mootaProvider = makeSyncProvider({
  ...veniceProviderBase(mootaProviderDef, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.bank_id,
        entityName: 'account',
        entity: {
          name: `${a.label} ${a.atas_nama} (${a.account_number})`,
          informationalBalances: {
            current: A(Number.parseFloat(a.balance), 'IDR'),
          },
          type: 'asset/bank',
          countryCode: 'ID',
          institutionName: a.label,
          defaultUnit: 'IDR' as Unit,
        },
      }),

      transaction: ({entity: t}) => ({
        id: t.mutation_id,
        entityName: 'transaction',
        entity: {
          date: toISO(t.created_at),
          description: t.description,
          payee: t.note, // Payee is a bit better due to the lack of separate payee field in moota
          labelsMap: objectFromArray(
            t.taggings ?? [],
            (tag) => tag.name,
            () => true,
          ),
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.bank_id as ExternalId,
              amount:
                t.type === 'CR'
                  ? A(Number.parseFloat(t.amount), 'IDR')
                  : A(-Number.parseFloat(t.amount), 'IDR'),
            },
          }),
        },
      }),
    },
  }),
  sourceSync: ({config}) => {
    const moota = makeMootaClient(config)
    const accounts: Moota.BankAccount[] = []
    async function* iterateEntities() {
      for await (const acc of moota.iterateAllBankAccounts()) {
        accounts.push(...acc.data)
        yield acc.data.map((a) =>
          mootaProviderDef._opData('account', a.bank_id, a),
        )
      }

      for (const {bank_id} of accounts) {
        for await (const transaction of moota.iterateAllTransactions({
          bank_id,
        })) {
          yield transaction.data.map((t) =>
            mootaProviderDef._opData('transaction', t.mutation_id, t),
          )
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, mootaProviderDef._op('commit')]),
        ),
      )
  },
})
