import {VeniceProvider} from '@usevenice/engine-frontend'
import {joinPath, zParser} from '@usevenice/util'

import {PROVIDERS, zCommonEnv} from './env'

export const commonEnv = zParser(zCommonEnv).parse({
  // Need to use fully qualified form of process.env.$VAR for
  // webpack DefineEnv that next.js uses to work
  NEXT_PUBLIC_SERVER_URL: process.env['NEXT_PUBLIC_SERVER_URL']!,
  NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
})

// TODO: Removing providers we are not using so we don't have nearly as much code, at least on the frontend!
// Further perhaps code from supported providers can be loaded dynamically based on
// listIntegrations output.
export const veniceCommonConfig = VeniceProvider.config({
  // Turn providers into a map rather than array so that we can prevent from
  // a data-structure level multiple providers with the same `name` being passed in?
  providers: PROVIDERS,

  // routerUrl: 'http://localhost:3010/api', // apiUrl?
  apiUrl: joinPath(commonEnv.NEXT_PUBLIC_SERVER_URL, '/api/trpc'),

  // parseJwtPayload // use default here
})

// console.log('Using config', veniceConfig) // Too verbose...
