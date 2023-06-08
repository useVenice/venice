// @deprecated. Soon to be fully replaced by integrations.merge.ts

import {debugProvider} from '@usevenice/cdk-core'
import {corePostgresProvider} from '@usevenice/core-integration-postgres'

import {mergedIntegrations} from './integrations/integrations.merged'

export const DOCUMENTED_PROVIDERS = [
  ...(Object.values(mergedIntegrations) as unknown as Array<
    typeof debugProvider
  >),
] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // TODO: Migrate these over to the new paradigm
  debugProvider,
  corePostgresProvider,
] as const
