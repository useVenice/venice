import {inngest} from '@usevenice/web/inngest/events'

import {serve} from 'inngest/next'
import * as functions from '@usevenice/web/inngest/functions'

export default serve(inngest.name, Object.values(functions), {
  // serveHost: 'http://localhost:3010',
  // servePath: 'api/inngest'
})
