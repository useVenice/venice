import type {Id} from '@usevenice/cdk-core'
import {
  debugProvider,
  extractProviderName,
  metaForProvider,
  zIntegrationStage,
} from '@usevenice/cdk-core'
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
import {R, sort} from '@usevenice/util'

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

export const allProviders = sort(PROVIDERS.map(metaForProvider)).desc((p) =>
  zIntegrationStage.options.indexOf(p.stage),
)

export const providerByName = R.mapToObj(allProviders, (p) => [p.name, p])

export const availableProviders = allProviders.filter(
  (p) => p.stage !== 'hidden',
)

export function providerMetaForId(id: Id['reso'] | Id['int']) {
  const providerName = extractProviderName(id)
  return providerByName[providerName]
}
