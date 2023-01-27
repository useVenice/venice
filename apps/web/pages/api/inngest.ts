import {inngest} from '../../inngest/events'

import {serve} from 'inngest/next'
import * as functions from '../../inngest/functions'

export default serve(inngest.name, Object.values(functions), {
  // serveHost: 'http://localhost:3010',
  // servePath: 'api/inngest'
})
