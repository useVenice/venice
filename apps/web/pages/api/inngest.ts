import {serve} from 'inngest/next'

import {inngest} from '@usevenice/engine-backend/events'
import {withLog} from '@usevenice/util'

import * as functions from '../../inngest/functions'

export const config = {
  maxDuration: 5 * 60, // 5 mins
}

export default serve(
  inngest.name,
  Object.values(functions),
  withLog('Starting inngest with', {
    landingPage: process.env['VERCEL_ENV'] !== 'production',
    logLevel: 'warn',
    // Enforce dev env never hit production inngest
    // https://discord.com/channels/842170679536517141/1080275520861782096/1080494988741324870
    inngestRegisterUrl:
      // For debugging...
      process.env['INNGEST_REGISTER_URL'] ??
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:8288/fn/register'
        : undefined),
    // For debugging, via e.g. 'http://localhost:3010' via mitmproxy
    serveHost: process.env['INNGEST_SERVE_HOST'],
  }),
)
