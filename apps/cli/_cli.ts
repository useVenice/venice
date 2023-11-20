/* eslint-disable @typescript-eslint/no-unsafe-argument */
import '@usevenice/app-config/register.node'
import 'global-agent/bootstrap'

import {ProxyAgent, setGlobalDispatcher} from 'undici'

import {parseIntConfigsFromRawEnv} from '@usevenice/app-config/integration-envs'
import type {defIntegrations} from '@usevenice/app-config/integrations/integrations.def'
import {makeJwtClient, makeNangoClient} from '@usevenice/cdk'
import {makeAlphavantageClient} from '@usevenice/connector-alphavantage'
import {makeHeronClient} from '@usevenice/connector-heron'
import {makeLunchmoneyClient} from '@usevenice/connector-lunchmoney'
import {makeMergeClient} from '@usevenice/connector-merge'
import {makeMootaClient} from '@usevenice/connector-moota'
import {makeOneBrickClient} from '@usevenice/connector-onebrick'
// Make this import dynamic at runtime, so we can do
// dynamic-cli plaid ......  or
// OBJ=$pathToPlaid dynamic-cli whatever...
// Or perhaps we can make it into a register and/or loader for nodejs
// much like tsx and others
import {makePlaidClient} from '@usevenice/connector-plaid'
import {makePostgresClient} from '@usevenice/connector-postgres'
import {makeRampClient} from '@usevenice/connector-ramp'
import {makeSaltedgeClient} from '@usevenice/connector-saltedge'
import {makeStripeClient} from '@usevenice/connector-stripe'
import {makeTellerClient} from '@usevenice/connector-teller'
import {makeTogglClient} from '@usevenice/connector-toggl'
import {makeWiseClient} from '@usevenice/connector-wise'
import {makeYodleeClient} from '@usevenice/connector-yodlee'
import {getEnv} from '@usevenice/env'
import {AirbytePublicSDK} from '@usevenice/meta-service-airbyte/airbyte-sdk'
import {makePostgresMetaService} from '@usevenice/meta-service-postgres'
import {createVeniceClient} from '@usevenice/sdk'
import type {ZFunctionMap} from '@usevenice/util'
import {getEnvVar, R, z, zodInsecureDebug} from '@usevenice/util'

import type {CliOpts} from './cli-utils'
import {cliFromZFunctionMap} from './cli-utils'

setGlobalDispatcher(new ProxyAgent(process.env['GLOBAL_AGENT_HTTP_PROXY']!))

if (getEnvVar('DEBUG_ZOD')) {
  zodInsecureDebug()
}

function env() {
  process.env['_SKIP_ENV_VALIDATION'] = 'true'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return require('@usevenice/app-config/env')
    .env as typeof import('@usevenice/app-config/env')['env']
}

function intConfig<T extends keyof typeof defIntegrations>(name: T) {
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
      makeJwtClient({secretOrPublicKey: env().JWT_SECRET_OR_PUBLIC_KEY}),
    pg: () => makePostgresClient({databaseUrl: env().POSTGRES_OR_WEBHOOK_URL}),
    pgMeta: () =>
      makePostgresMetaService({
        databaseUrl: env().POSTGRES_OR_WEBHOOK_URL,
        viewer: {role: 'system'},
      }) as {},
    plaid: () => makePlaidClient(intConfig('plaid')) as {},
    onebrick: () => makeOneBrickClient(intConfig('onebrick')) as {},
    teller: () => makeTellerClient(intConfig('teller')),
    stripe: () =>
      makeStripeClient({apiKey: process.env['_STRIPE_TEST_SECRET_KEY']!}),
    ramp: () => makeRampClient(intConfig('ramp').oauth),
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

    'merge.accounting': () =>
      makeMergeClient({
        apiKey: process.env['_MERGE_TEST_API_KEY'] ?? '',
        accountToken: process.env['_MERGE_TEST_LINKED_ACCOUNT_TOKEN'] ?? '',
      }).accounting,
    'merge.integrations': () =>
      makeMergeClient({
        apiKey: process.env['_MERGE_TEST_API_KEY'] ?? '',
        accountToken: process.env['_MERGE_TEST_LINKED_ACCOUNT_TOKEN'] ?? '',
      }).integrations,
    heron: () => makeHeronClient({apiKey: process.env['_HERON_API_KEY']!}),
    nango: () =>
      makeNangoClient({secretKey: process.env['_NANGO_SECRET_KEY']!}),
    airbyte: () =>
      AirbytePublicSDK({accessToken: process.env['_AIRBYTE_ACCESS_TOKEN']!}),
    sdk: () =>
      createVeniceClient({
        apiKey: getEnv('VENICE_API_KEY'),
        resourceId: getEnv('VENICE_RESOURCE_ID'),
      }),
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
