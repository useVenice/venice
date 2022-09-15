#!/usr/bin/env tsx
// This import line gets frequently moved by vscode organize imports
// and thus causing runtime failure... Therefore we moved it to the ledgerSync bin
import '@ledger-sync/app-config/register.node'

import http from 'node:http'

import {nodeHTTPRequestHandler} from '@trpc/server/adapters/node-http'
import {json} from 'micro'
import ngrok from 'ngrok'

import {
  ledgerSyncRouter,
  syncEngine,
} from '@ledger-sync/app-config/backendConfig'
import {parseWebhookRequest} from '@ledger-sync/engine-backend'
import type {NonEmptyArray} from '@ledger-sync/util'
import {
  compact,
  parseUrl,
  R,
  z,
  zFunction,
  zodInsecureDebug,
} from '@ledger-sync/util'

import {cliFromRouter} from './cli-utils'

if (!process.env['DEBUG']) {
  console.debug = () => {} // Disabling debug logs
}
if (process.env['DEBUG_ZOD']) {
  zodInsecureDebug()
}

export const cli = cliFromRouter(ledgerSyncRouter, {
  cleanup: () => {}, // metaService.shutdown?
  context: syncEngine.zAccessTokenContext.parse(process.env['ACCESS_TOKEN']),
})

cli
  .command('serve [port]', 'Creates a standalone server for testing')
  .option('--ngrok', 'Start ngrok tunnel')
  .action(
    zFunction(
      [z.number().default(4005), z.object({ngrok: z.boolean().nullish()})],
      async (port, opts) => {
        const server = new http.Server(async (req, res) => {
          const {query, segments} = R.pipe(parseUrl(req.url ?? ''), (url) => ({
            query: url.query,
            // compact will remove leading `/`
            segments: compact(url.url.split('/')) as NonEmptyArray<string>,
          }))
          let procedure = segments[0]

          if (parseWebhookRequest.isWebhook(segments)) {
            const ret = parseWebhookRequest({
              method: req.method,
              headers: req.headers,
              pathSegments: segments,
              query,
              body: await json(req).catch(() => undefined),
            })
            procedure = ret.procedure
            // @ts-expect-error
            req.query = ret.query
            // @ts-expect-error
            req.body = ret.body // Still need this even for GET since we exhausted the stream otherwise handler will hang
          }
          return nodeHTTPRequestHandler({
            router: ledgerSyncRouter,
            path: procedure,
            req,
            res,
            createContext: ({req}) =>
              syncEngine.zAccessTokenContext.parse(
                req.headers.authorization?.match(/^Bearer (.+)/)?.[1],
              ),
          })
        })

        server.listen(port)

        const actualPort = R.pipe(
          server.address(),
          (addr) => addr as Exclude<typeof addr, string>,
          (addr) => addr?.port ?? port,
        )
        console.log(`listening on port ${actualPort}`)

        if (opts.ngrok) {
          await ngrok.kill()
          // Add subdomain when we support it
          // Only works one at a time due to web-interface being at port 4040 always.
          // To have multiple ngrok instances, use
          // https://stackoverflow.com/questions/36018375/how-to-change-ngroks-web-interface-port-address-not-4040
          const serverUrl = await ngrok.connect({addr: actualPort})
          console.log('ngrok ready at', serverUrl)
          console.log('ngrok web interface', 'http://localhost:4040')
        }
      },
    ),
  )

export default cli

if (require.main === module) {
  cli.help().parse()
}
