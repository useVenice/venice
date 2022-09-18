/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {PROVIDERS} from '@ledger-sync/app-config/env'
import {parseIntConfigsFromEnv, zAllEnv} from '@ledger-sync/app-config/env'

import '@ledger-sync/app-config/register.node'

import {loadedEnv} from '@ledger-sync/app-config/register.node'
import {
  makePostgresClient,
  makePostgresMetaService,
} from '@ledger-sync/core-integration-postgres'
import {makeJwtClient} from '@ledger-sync/engine-backend'
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
import {makeYodleeClient} from '@ledger-sync/integration-yodlee'
import type {ZFunctionMap} from '@ledger-sync/util'
import {getEnvVar, R, z, zodInsecureDebug, zParser} from '@ledger-sync/util'

import type {CliOpts} from './cli-utils'
import {cliFromZFunctionMap} from './cli-utils'

if (getEnvVar('DEBUG_ZOD')) {
  zodInsecureDebug()
}

function env() {
  return zParser(zAllEnv).parseUnknown(loadedEnv)
}
function intConfig<T extends typeof PROVIDERS[number]['name']>(name: T) {
  const config = parseIntConfigsFromEnv(env())[name]
  if (!config) {
    throw new Error(`${name} provider is not configured`)
  }
  return config
}

if (require.main === module) {
  type ClientMap = Record<string, () => [ZFunctionMap, CliOpts] | ZFunctionMap>
  const clients: ClientMap = {
    env: () => ({
      ...R.mapValues(env(), (v) => () => v),
      '': () => env(),
    }),
    intConfig: () => ({
      ...R.mapValues(parseIntConfigsFromEnv(env()), (v) => () => v),
      '': () => parseIntConfigsFromEnv(env()),
    }),
    jwt: () =>
      makeJwtClient({secretOrPublicKey: env().JWT_SECRET_OR_PUBLIC_KEY!}),
    pg: () => makePostgresClient({databaseUrl: env().POSTGRES_URL}),
    pgMeta: () =>
      makePostgresMetaService({databaseUrl: env().POSTGRES_URL}) as {},
    plaid: () => makePlaidClient(intConfig('plaid')),
    onebrick: () => makeOneBrickClient(intConfig('onebrick')),
    teller: () => makeTellerClient(intConfig('teller')),
    stripe: () => makeStripeClient(intConfig('stripe')),
    ramp: () => makeRampClient(intConfig('ramp')),
    wise: () => makeWiseClient(intConfig('wise')),
    toggl: () => makeTogglClient(intConfig('toggl')),
    yodlee: () =>
      makeYodleeClient(
        intConfig('yodlee'),
        getEnvVar('YODLEE_CREDS', {json: true}),
      ),
  }

  const clientFactory = z
    .enum(Object.keys(clients) as [keyof typeof clients], {
      errorMap: () => ({message: 'Invalid process.env.CLI'}),
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .transform((key) => clients[key]!)
    .parse(getEnvVar('CLI'))

  const [client, opts] = R.pipe(clientFactory(), (r) =>
    Array.isArray(r) ? r : [r],
  )

  cliFromZFunctionMap(client, opts).help().parse()
}
