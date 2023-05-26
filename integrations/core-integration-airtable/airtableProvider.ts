import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import type {EntityPayloadWithExternal} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import {fromCompletion, z, zCast} from '@usevenice/util'

import {makeAirtableClient, zAirtableResourceSettings} from './AirtableClient'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('airtable'),
  resourceSettings: zAirtableResourceSettings,
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
})

export const airtableProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  metadata: {categories: ['database'], logoUrl: '/_assets/logo-airtable.svg'},
  def,
  // metadata: {logoUrl: '/_assets/logo-airtable.png'},
  destinationSync: ({settings}) => {
    const airtable = makeAirtableClient(settings)
    airtable.initBase()

    return handlersLink({
      // eslint-disable-next-line @typescript-eslint/require-await
      data: async (op) => {
        const {
          data: {id, entityName, providerName, sourceId = null, ...data},
        } = op

        const transactionData = (
          entityName === 'transaction'
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              (data.entity as any).standard
            : null
        ) as Standard.Transaction
        const partialTxn =
          entityName === 'transaction'
            ? {
                Date: transactionData.date,
                Category: transactionData.description,
                Amount: `${transactionData.postingsMap?.main?.amount.unit} ${transactionData.postingsMap?.main?.amount.quantity}`,
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
