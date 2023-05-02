import type {AnySyncProvider} from '@usevenice/cdk-core'
import {debugProvider, zIntegrationStage} from '@usevenice/cdk-core'
import {airtableProvider} from '@usevenice/core-integration-airtable'
import {firebaseProvider} from '@usevenice/core-integration-firebase'
import {fsProvider} from '@usevenice/core-integration-fs'
import {mongodbProvider} from '@usevenice/core-integration-mongodb'
import {corePostgresProvider} from '@usevenice/core-integration-postgres'
import {webhookProvider} from '@usevenice/core-integration-webhook'
import {beancountProvider} from '@usevenice/integration-beancount'
import {brexImpl} from '@usevenice/integration-brex'
import {foreceiptProvider} from '@usevenice/integration-foreceipt'
import {heronImpl} from '@usevenice/integration-heron'
import {importProvider} from '@usevenice/integration-import'
import {lunchmoneyProvider} from '@usevenice/integration-lunchmoney'
import {mergeImpl} from '@usevenice/integration-merge'
import {mootaProvider} from '@usevenice/integration-moota'
import {oneBrickProvider} from '@usevenice/integration-onebrick'
import {plaidProvider} from '@usevenice/integration-plaid'
import {postgresProvider} from '@usevenice/integration-postgres'
import {QBOProvider} from '@usevenice/integration-qbo'
import {rampProvider} from '@usevenice/integration-ramp'
import {saltedgeProvider} from '@usevenice/integration-saltedge'
import {splitwiseProvider} from '@usevenice/integration-splitwise'
import {stripeImpl} from '@usevenice/integration-stripe'
import {tellerProvider} from '@usevenice/integration-teller'
import {togglProvider} from '@usevenice/integration-toggl'
import {venmoProvider} from '@usevenice/integration-venmo'
import {wiseProvider} from '@usevenice/integration-wise'
import {yodleeProvider} from '@usevenice/integration-yodlee'
import {R, sort, titleCase, urlFromImage} from '@usevenice/util'

export {plaidProvider, fsProvider}

export const DOCUMENTED_PROVIDERS = [
  plaidProvider,
  mergeImpl as unknown as typeof plaidProvider,
  heronImpl as unknown as typeof plaidProvider,
] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // Core
  debugProvider,
  fsProvider,
  firebaseProvider,
  mongodbProvider,
  corePostgresProvider,
  airtableProvider,
  webhookProvider,
  // Ledger
  yodleeProvider,
  beancountProvider,
  importProvider,
  lunchmoneyProvider,
  oneBrickProvider,
  tellerProvider,
  rampProvider,
  wiseProvider,
  togglProvider,
  foreceiptProvider,

  splitwiseProvider,
  postgresProvider,
  mootaProvider,
  QBOProvider,
  saltedgeProvider,
  venmoProvider,
  // New ones
  stripeImpl as unknown as typeof plaidProvider, // Hack for now..
  brexImpl as unknown as typeof plaidProvider, // Hack for now..
] as const

export const allProviders = sort(
  PROVIDERS.map((provider: AnySyncProvider) => ({
    // ...provider,
    name: provider.name,
    displayName: provider.metadata?.displayName ?? titleCase(provider.name),
    logoUrl: provider.metadata?.logoSvg
      ? urlFromImage({type: 'svg', data: provider.metadata?.logoSvg})
      : provider.metadata?.logoUrl,
    stage: provider.metadata?.stage ?? 'alpha',
    platforms: provider.metadata?.platforms ?? ['cloud', 'local'],
    categories: provider.metadata?.categories ?? ['other'],
    supportedModes: R.compact([
      provider.sourceSync ? ('source' as const) : null,
      provider.destinationSync ? ('destination' as const) : null,
    ]),
    preConnectNeeded: provider.preConnect != null,
    useConnectHookNeeded: provider.useConnectHook != null,
    def: provider.def,
  })),
).desc((p) => zIntegrationStage.options.indexOf(p.stage))

export type ProviderMeta = (typeof allProviders)[number]

export const providerByName = R.mapToObj(allProviders, (p) => [p.name, p])

export const availableProviders = allProviders.filter(
  (p) => p.stage !== 'hidden',
)
