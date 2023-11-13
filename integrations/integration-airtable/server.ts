import type {IntegrationServer} from '@usevenice/cdk'
import {handlersLink} from '@usevenice/cdk'
import type {Pta} from '@usevenice/cdk'
import {fromCompletion} from '@usevenice/util'

import {makeAirtableClient} from './AirtableClient'
import type {airtableSchemas} from './def'

export const airtableServer = {
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
        ) as Pta.Transaction
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
            External: JSON.stringify(data.raw),
            ...partialTxn,
          },
        }

        fromCompletion(airtable.insertData({data: record, entityName}))
        return op
      },
    })
  },
} satisfies IntegrationServer<typeof airtableSchemas>

export default airtableServer
