import type {LinkFactory} from '@usevenice/cdk-core'
import {logLink} from '@usevenice/cdk-core'
import {renameAccountLink} from '@usevenice/cdk-ledger'
import type {PipelineInput} from '@usevenice/engine-backend'
import {getContextFactory} from '@usevenice/engine-backend'
import {makePostgresMetaService} from '@usevenice/meta-service-postgres'
import {joinPath} from '@usevenice/util'

import {getServerUrl} from './constants'
import {env} from './env'
import {mergedIntegrations} from './integrations/integrations.merged'

export {
  DatabaseError,
  makePostgresClient,
} from '@usevenice/integration-postgres/makePostgresClient'
export {Papa} from '@usevenice/integration-spreadsheet'

export const backendEnv = env

/**
 * This requires the env vars to exist...
 * TODO: Separate it so that the entire config isn't constructed client side
 * and only the minimal needed methods are...
 */

// After upgrading from zod 3.19 to zod 3.20.2 CastInput is now broken
// @see https://share.cleanshot.com/vpzSPkjP
// It's probably better to keep typing simpler especially when working with 3rd party
// libs that can have major changes...
// export type VeniceInput = inferProcedureInput<
//   VeniceRouter['_def']['mutations']['syncPipeline']
// >[0]
export type VeniceInput = PipelineInput<
  (typeof mergedIntegrations)[keyof typeof mergedIntegrations],
  (typeof mergedIntegrations)[keyof typeof mergedIntegrations]
>

export const contextFactory = getContextFactory({
  providers: Object.values(mergedIntegrations),
  // routerUrl: 'http://localhost:3010/api', // apiUrl?
  // TODO: Rename to just serverUrl as we will need it for redirects and everything else
  apiUrl: joinPath(getServerUrl(null), '/api/trpc'),
  // TODO: Clean up the duplication .env and .env.NANGO_SECRET_KEY etc.
  env,
  jwtSecret: env.JWT_SECRET_OR_PUBLIC_KEY,
  nangoSecretKey: env.NANGO_SECRET_KEY,
  // TODO: Remove this now that we use nango for redirects?
  // Although updating nangoUrl right now happens by hand which is not ideal
  getRedirectUrl: (_, _ctx) => joinPath(getServerUrl(null), '/'),
  // TODO: Do we realy need to support anything other than postgres?
  getMetaService: (viewer) =>
    makePostgresMetaService({databaseUrl: env.POSTGRES_OR_WEBHOOK_URL, viewer}),
  // TODO: This probably needs to be internal to the engine-backend or even cdk-core
  // because of the need to support integration metadata specifying their desired links
  // aka transfomrations
  linkMap: {
    renameAccount: renameAccountLink as LinkFactory,
    log: logLink,
  },
})
