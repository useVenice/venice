import {initTwentySDK} from '@opensdks/sdk-twenty'
import type {ConnectorServer} from '@usevenice/cdk'
import {handlersLink} from '@usevenice/cdk'
import * as unified from './crm-unifiedModels'
import type {twentySchemas} from './def'

export const twentyServer = {
  destinationSync: ({settings}) => {
    const twenty = initTwentySDK({
      headers: {authorization: `Bearer ${settings.access_token}`},
    })

    return handlersLink({
      data: async (op) => {
        // crm account
        if (op.data.entityName === 'account') {
          const account = unified.account
            .partial()
            .nullish()
            .parse(op.data.entity)
          if (account) {
            await twenty.core.POST('/companies', {
              body: {
                name: account.name ?? '',
                // TODO: What's the standard format for website
                domainName: account.website ?? '',
              },
            })
          }
        }
        return op
      },
    })
  },
} satisfies ConnectorServer<typeof twentySchemas>

export default twentyServer
