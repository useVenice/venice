import {inngest} from '@usevenice/engine-backend/events'

import {serve} from 'inngest/next'
import * as functions from '../../inngest/functions'

export default serve(inngest.name, Object.values(functions), {
  landingPage: process.env['VERCEL_ENV'] !== 'production',
  // serveHost: 'http://localhost:3010',
  // servePath: 'api/inngest'
})
