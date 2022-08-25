import {handlersLink, makeSyncProvider} from '@ledger-sync/core-sync'
import {
  EntityPayloadWithExternal,
  ledgerSyncProviderBase,
} from '@ledger-sync/ledger-sync'
import {fromCompletion, Rx, rxjs, z, zCast} from '@ledger-sync/util'
import {
  makeAirtableClient,
  zAccount,
  zAirtableConnectionSettings,
  zTransaction,
} from './AirtableClient'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('airtable'),
  connectionSettings: zAirtableConnectionSettings,
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zAccount,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zTransaction,
    }),
  ]),
})

export const airtableProvider = makeSyncProvider({
  // ...makeSyncProvider.defaults,
  // def,
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.Id,
        entityName: 'account',
        entity: JSON.parse(a.Standard)['standard'] as Standard.Account,
      }),
      transaction: ({entity: t}) => ({
        id: t.Id,
        entityName: 'transaction',
        entity: JSON.parse(t.Standard)['standard'] as Standard.Transaction,
      }),
    },
  }),

  sourceSync: ({settings}) => {
    const airtable = makeAirtableClient(settings)
    airtable.initBase()

    async function* iterateEntities() {
      const transactions = await airtable.getEntity2('Transaction')
      const accounts = await airtable.getEntity2('Account')

      yield accounts.map((record) => {
        const a = record.fields as z.infer<typeof zAccount>
        return def._opData('account', `${a.Id}`, a)
      })
      yield transactions.map((record) => {
        const t = record.fields as z.infer<typeof zTransaction>
        return def._opData('transaction', `${t.Id}`, t)
      })
    }
    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },
  destinationSync: ({settings}) => {
    const airtable = makeAirtableClient(settings)
    airtable.initBase()

    return handlersLink({
      data: async (op) => {
        const {
          data: {id, entityName, providerName, connectionId = null, ...data},
        } = op

        const transactionData = (
          entityName === 'transaction' ? (data.entity as any)['standard'] : null
        ) as Standard.Transaction
        const partialTxn =
          entityName === 'transaction'
            ? {
                Date: transactionData?.date,
                Category: transactionData?.description,
                Amount: `${transactionData?.postingsMap?.main?.amount.unit} ${transactionData?.postingsMap?.main?.amount.quantity}`,
                Payee: '', // TODO: Find way to get this data or use the same as 'Description'
              }
            : {}

        const record = {
          fields: {
            Id: id,
            'Provider Name': providerName,
            Standard: JSON.stringify(data.entity),
            External: JSON.stringify(data.external),
            ...partialTxn,
          },
        }

        fromCompletion(airtable.insertData({data: record, entityName}))
        return op
      },
    })
  },
})
