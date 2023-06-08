// @deprecated. Soon to be fully replaced by integrations.merge.ts

import {debugProvider} from '@usevenice/cdk-core'
import {firebaseProvider} from '@usevenice/core-integration-firebase'
import {fsProvider} from '@usevenice/integration-fs'
import {mongodbProvider} from '@usevenice/core-integration-mongodb'
import {corePostgresProvider} from '@usevenice/core-integration-postgres'
import {webhookProvider} from '@usevenice/core-integration-webhook'

import {mergedIntegrations} from './integrations/integrations.merged'

export const DOCUMENTED_PROVIDERS = [
  ...(Object.values(mergedIntegrations) as unknown as Array<
    typeof debugProvider
  >),
] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // TODO: Migrate these over to the new paradigm
  fsProvider,
  firebaseProvider,
  mongodbProvider,
  webhookProvider,
  debugProvider,
  corePostgresProvider,
] as const
