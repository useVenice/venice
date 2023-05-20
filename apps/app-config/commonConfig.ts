import type {AnySyncProvider, LinkFactory} from '@usevenice/cdk-core'
import type {SyncEngineCommonConfig} from '@usevenice/engine-frontend'
import {joinPath} from '@usevenice/util'

import {getServerUrl} from './constants'
import {env} from './env'
import {PROVIDERS} from './providers'

export {Papa} from '@usevenice/integration-import'

export const commonEnv = env

// TODO: Removing providers we are not using so we don't have nearly as much code, at least on the frontend!
// Further perhaps code from supported providers can be loaded dynamically based on
// listIntegrations output.
export const veniceCommonConfig = {
  // Turn providers into a map rather than array so that we can prevent from
  // a data-structure level multiple providers with the same `name` being passed in?
  providers: PROVIDERS,

  // routerUrl: 'http://localhost:3010/api', // apiUrl?
  apiUrl: joinPath(getServerUrl(null), '/api/trpc'),
} satisfies SyncEngineCommonConfig<
  readonly AnySyncProvider[],
  Record<string, LinkFactory>
>

// console.log('Using config', veniceConfig) // Too verbose...
