import {serve} from 'inngest/next'
import * as functions from '../../inngest/functions'

export default serve('Venice', Object.values(functions), {
  // serveHost: 'http://localhost:3010',
  // servePath: 'api/inngest'
})
