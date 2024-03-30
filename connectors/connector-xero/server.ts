import {initXeroSDK} from '@opensdks/sdk-xero'
import type {ConnectorServer} from '@usevenice/cdk'
import type {xeroSchemas} from './def'

export const xeroServer = {
  newInstance: ({settings}) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const xero = initXeroSDK({
      headers: {authorization: `Bearer ${settings.access_token}`},
    })
    // TODO(@jatin): Add logic here to handle sync.
    return xero
  },
} satisfies ConnectorServer<typeof xeroSchemas>

export default xeroServer
