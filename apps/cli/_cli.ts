// Not sure why ../node_modules import needed... was working before
import {
  asFunction,
  kProxyAgent,
  R,
  registerDependency,
  safeJSONParse,
  z,
  ZFunctionMap,
} from '@ledger-sync/util'
import {makeProxyAgentNext} from '@ledger-sync/app-config/server/http-utils-next'
import {makeOneBrickClient} from '@ledger-sync/integration-onebrick'
// Make this import dynamic at runtime, so we can do
// dynamic-cli plaid ......  or
// OBJ=$pathToPlaid dynamic-cli whatever...
// Or perhaps we can make it into a register and/or loader for nodejs
// much like tsx and others
import {makePlaidClient} from '@ledger-sync/integration-plaid'
import {makeRampClient} from '@ledger-sync/integration-ramp'
import {makeStripeClient} from '@ledger-sync/integration-stripe'
import {makeTellerClient} from '@ledger-sync/integration-teller'
import {makeTogglClient} from '@ledger-sync/integration-toggl'
import {makeWiseClient} from '@ledger-sync/integration-wise'
import {cliFromZFunctionMap, CliOpts} from './cli-utils'

if (require.main === module) {
  registerDependency(
    kProxyAgent,
    asFunction(() =>
      makeProxyAgentNext({
        url: process.env['PROXY_URL'] ?? '',
        cert: process.env['PROXY_CERT'] ?? '',
      }),
    ).singleton(),
  )

  type ClientMap = Record<string, () => [ZFunctionMap, CliOpts] | ZFunctionMap>
  const clients: ClientMap = {
    plaid: () =>
      makePlaidClient(safeJSONParse(process.env['PLAID_CREDENTIALS'])),
    onebrick: () =>
      makeOneBrickClient(safeJSONParse(process.env['ONEBRICK_CREDENTIALS'])),
    teller: () =>
      makeTellerClient(safeJSONParse(process.env['TELLER_CREDENTIALS'])),
    stripe: () =>
      makeStripeClient(safeJSONParse(process.env['STRIPE_CREDENTIALS'])),
    ramp: () => makeRampClient(safeJSONParse(process.env['RAMP_CONFIG'])),
    wise: () => makeWiseClient(safeJSONParse(process.env['WISE_CREDENTIALS'])),
    toggl: () =>
      makeTogglClient(safeJSONParse(process.env['TOGGL_CREDENTIALS'])),
  }

  const clientFactory = z
    .enum(Object.keys(clients) as [keyof typeof clients], {
      errorMap: () => ({message: `Invalid process.env.CLIENT`}),
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .transform((key) => clients[key]!)
    .parse(process.env['CLIENT'])

  const [client, opts] = R.pipe(clientFactory(), (r) =>
    Array.isArray(r) ? r : [r],
  )

  cliFromZFunctionMap(client, opts).help().parse()
}
