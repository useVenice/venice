/* eslint-disable @typescript-eslint/no-unsafe-argument */
import '@usevenice/app-config/register.node'

import type {PROVIDERS} from '@usevenice/app-config/env'
import {parseIntConfigsFromRawEnv, zAllEnv} from '@usevenice/app-config/env'
import {loadedEnv} from '@usevenice/app-config/register.node'
import {
  makePostgresClient,
  makePostgresMetaService,
} from '@usevenice/core-integration-postgres'
import {makeJwtClient} from '@usevenice/engine-backend'
import {makeAlphavantageClient} from '@usevenice/integration-alphavantage'
import {makeLunchmoneyClient} from '@usevenice/integration-lunchmoney'
import {makeMootaClient} from '@usevenice/integration-moota'
import {makeOneBrickClient} from '@usevenice/integration-onebrick'
// Make this import dynamic at runtime, so we can do
// dynamic-cli plaid ......  or
// OBJ=$pathToPlaid dynamic-cli whatever...
// Or perhaps we can make it into a register and/or loader for nodejs
// much like tsx and others
import {makePlaidClient} from '@usevenice/integration-plaid'
import {makeRampClient} from '@usevenice/integration-ramp'
import {makeSaltedgeClient} from '@usevenice/integration-saltedge'
import {makeStripeClient} from '@usevenice/integration-stripe'
import {makeTellerClient} from '@usevenice/integration-teller'
import {makeTogglClient} from '@usevenice/integration-toggl'
import {makeWiseClient} from '@usevenice/integration-wise'
import {makeYodleeClient} from '@usevenice/integration-yodlee'
import type {ZFunctionMap} from '@usevenice/util'
import {getEnvVar, R, z, zodInsecureDebug, zParser} from '@usevenice/util'

import type {CliOpts} from './cli-utils'
import {cliFromZFunctionMap} from './cli-utils'

if (getEnvVar('DEBUG_ZOD')) {
  zodInsecureDebug()
}

function env() {
  return zParser(zAllEnv).parseUnknown(loadedEnv)
}
function intConfig<T extends typeof PROVIDERS[number]['name']>(name: T) {
  const config = parseIntConfigsFromRawEnv()[name]
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
      ...R.mapValues(parseIntConfigsFromRawEnv(), (v) => () => v),
      '': () => parseIntConfigsFromRawEnv(),
    }),
    jwt: () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      makeJwtClient({secretOrPublicKey: env().JWT_SECRET_OR_PUBLIC_KEY!}),
    pg: () => makePostgresClient({databaseUrl: env().POSTGRES_OR_WEBHOOK_URL}),
    pgMeta: () =>
      makePostgresMetaService({
        databaseUrl: env().POSTGRES_OR_WEBHOOK_URL,
      }) as {},
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getEnvVar('YODLEE_CREDS', {json: true}) as any,
      ),
    alphavantage: () => makeAlphavantageClient({apikey: ''}),
    // asana: () => makeAsanaClient({baseURL: ''}),
    lunchmoney: () => makeLunchmoneyClient(intConfig('lunchmoney')),
    moota: () => makeMootaClient(intConfig('moota')),
    // qbo: () => makeQBOClient(intConfig('qbo')),
    saltedge: () => makeSaltedgeClient(intConfig('saltedge')),
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
