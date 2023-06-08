// @deprecated. Soon to be fully replaced by integrations.merge.ts

import {debugProvider} from '@usevenice/cdk-core'
import {firebaseProvider} from '@usevenice/core-integration-firebase'
import {fsProvider} from '@usevenice/core-integration-fs'
import {mongodbProvider} from '@usevenice/core-integration-mongodb'
import {corePostgresProvider} from '@usevenice/core-integration-postgres'
import {webhookProvider} from '@usevenice/core-integration-webhook'
import {beancountProvider} from '@usevenice/integration-beancount'
import {lunchmoneyProvider} from '@usevenice/integration-lunchmoney'
import {plaidProvider} from '@usevenice/integration-plaid'
import {postgresProvider} from '@usevenice/integration-postgres'
import {spreadsheetProvider} from '@usevenice/integration-spreadsheet'

import {mergedIntegrations} from './integrations/integrations.merged'

export {plaidProvider, fsProvider}

export const DOCUMENTED_PROVIDERS = [
  ...(Object.values(mergedIntegrations) as unknown as Array<
    typeof debugProvider
  >),
] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // TODO: Migrate these over to the new paradigm
  debugProvider,
  fsProvider,
  postgresProvider,
  firebaseProvider,
  mongodbProvider,
  corePostgresProvider,

  webhookProvider,
  beancountProvider,
  spreadsheetProvider,
  lunchmoneyProvider,
] as const
