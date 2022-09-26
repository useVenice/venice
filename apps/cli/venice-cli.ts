#!/usr/bin/env tsx
// This import line gets frequently moved by vscode organize imports
// and thus causing runtime failure... Therefore we moved it to the venice bin
import '@ledger-sync/app-config/register.node'

import http from 'node:http'

import {nodeHTTPRequestHandler} from '@trpc/server/adapters/node-http'
import {json} from 'micro'
import ngrok from 'ngrok'

import {syncEngine, veniceRouter} from '@ledger-sync/app-config/backendConfig'
import type {Id} from '@ledger-sync/cdk-core'
import {parseWebhookRequest} from '@ledger-sync/engine-backend'
import {kXLedgerId} from '@ledger-sync/engine-backend/auth-utils'
import type {NonEmptyArray} from '@ledger-sync/util'
import {
  compact,
  fromMaybeArray,
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

export const cli = cliFromRouter(veniceRouter, {
  cleanup: () => {}, // metaService.shutdown?
  context: syncEngine.zContext.parse<'typed'>({
    accessToken: process.env['ACCESS_TOKEN'],
    ledgerId: process.env['LEDGER_ID'] as Id['ldgr'] | undefined,
  }),
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
            router: veniceRouter,
            path: procedure,
            req,
            res,
            createContext: ({req}) =>
              syncEngine.zContext.parse<'typed'>({
                accessToken:
                  req.headers.authorization?.match(/^Bearer (.+)/)?.[1],
                ledgerId: fromMaybeArray(req.headers[kXLedgerId] ?? [])[0] as
                  | Id['ldgr']
                  | undefined,
              }),
            // onError: ({error}) => {
            //   // error.message = 'new message...'
            // },
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
