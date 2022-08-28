#!/usr/bin/env tsx
// Order of import is important and register.node has to come first, which is not great
// How do we fix this?
import '@ledger-sync/app-config/register.node'

import {
  LedgerSyncRouter,
  ledgerSyncMetaStore as metaStore,
  ledgerSyncRouter as router,
} from '@ledger-sync/app-config'
import {inferProcedureInput, parseWebhookRequest} from '@ledger-sync/engine'
import {
  compact,
  NonEmptyArray,
  parseUrl,
  R,
  z,
  zFunction,
} from '@ledger-sync/util'
import {nodeHTTPRequestHandler} from '@trpc/server/adapters/node-http'
import http from 'http'
import {json} from 'micro'
import ngrok from 'ngrok'
import {cliFromRouter} from './cli-utils'

if (!process.env['DEBUG']) {
  console.debug = () => {} // Disabling debug logs
}

export type LSRouter = LedgerSyncRouter
export type SyncInput = inferProcedureInput<
  LSRouter['_def']['mutations']['syncPipeline']
>[0]

export const cli = cliFromRouter(router, {cleanup: metaStore.kvStore.close})

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
          return nodeHTTPRequestHandler({router, path: procedure, req, res})
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
