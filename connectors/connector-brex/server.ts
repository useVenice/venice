/** Used for the side effect of window.MergeLink */
import type {ConnectorServer} from '@usevenice/cdk'
import {Rx, rxjs} from '@usevenice/util'

import {makeBrexClient} from './BrexClient'
import type {brexSchemas} from './def'
import {helpers} from './def'

export const brexServer = {
  sourceSync: ({settings}) => {
    const client = makeBrexClient({
      accessToken: settings.accessToken,
    })

    // TODO: Paginate obviously
    return rxjs
      .from(
        client.transactions
          .get('/v2/transactions/card/primary', {})
          .then((res) =>
            (res.items ?? [])?.map((txn) =>
              helpers._opData('transaction', txn.id ?? '', txn),
            ),
          ),
      )
      .pipe(Rx.mergeMap((ops) => rxjs.from(ops)))
  },
} satisfies ConnectorServer<typeof brexSchemas>

export default brexServer
