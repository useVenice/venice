// eslint-disable-next-line import/no-unresolved
import {initXeroSDK} from '@opensdks/sdk-xero' // FIXME: ensure SDK exists
import type {ConnectorServer} from '@usevenice/cdk'
import {handlersLink} from '@usevenice/cdk'
import type {xeroSchemas} from './def'

export const xeroServer = {
  destinationSync: ({settings}) => {
    const xero = initXeroSDK({
      headers: {authorization: `Bearer ${settings.access_token}`},
    })
    // TODO: add logic here.
    return handlersLink({})
  },
} satisfies ConnectorServer<typeof xeroSchemas>

export default xeroServer
