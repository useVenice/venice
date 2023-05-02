import type {AnySyncProvider, EnvName, LinkFactory} from '@usevenice/cdk-core'
import type {SyncEngineCommonConfig} from '@usevenice/engine-frontend'
import {joinPath, zParser} from '@usevenice/util'

import {getServerUrl} from './constants'
import {zCommonEnv} from './env'
import {PROVIDERS} from './providers'

export {Papa} from '@usevenice/integration-import'

type VercelEnv = 'production' | 'preview' | 'development'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const commonEnv = zParser(zCommonEnv).parse({
  // Need to use fully qualified form of process.env.$VAR for
  // webpack DefineEnv that next.js uses to work
  // TODO: Maybe we define defaults inside env.ts to avoid duplicating ourselves?
  NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
  NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN']!,
  NEXT_PUBLIC_POSTHOG_WRITEKEY: process.env['NEXT_PUBLIC_POSTHOG_WRITEKEY']!,
  DEFAULT_CONNECT_ENV: (
    {
      production: 'production',
      preview: 'development',
      development: 'sandbox',
    } satisfies Record<VercelEnv, EnvName>
  )[process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? ''],
})
/* eslint-enable @typescript-eslint/no-non-null-assertion */

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
