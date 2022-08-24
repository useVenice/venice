import {handlersLink, makeSyncProvider} from '@ledger-sync/core-sync'
import type {EntityPayloadWithExternal} from '@ledger-sync/ledger-sync'
import {fromCompletion, z, zCast} from '@ledger-sync/util'
import {
  airtableConnection,
  zAirtableConnectionSettings,
} from './airtableConnection'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('airtable'),
  connectionSettings: zAirtableConnectionSettings,
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
})

export const airtableProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings}) => {
    const airtable = airtableConnection(settings)
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
