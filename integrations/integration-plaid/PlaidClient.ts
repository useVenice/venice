import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid'

import {
  getDefaultProxyAgent,
  memoize,
  z,
  zCast,
  zFunction,
} from '@usevenice/util'

import {inferPlaidEnvFromToken} from './plaid-utils'
import type {WebhookShape} from './plaid.types'

type EnvName = z.infer<typeof zPlaidEnvName>
export const zPlaidEnvName = z.enum(['sandbox', 'development', 'production'])

// Too bad we cannot use it...
// export const zCountryCode = z.enum(
//   // Yay ts 4.1 https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum/64966647#64966647
//   Object.values(CountryCode) as NonEmptyArray<`${CountryCode}`>,
// )
export const zCountryCode = z.nativeEnum(CountryCode)
export const zProducts = z.nativeEnum(Products)

export const zLanguage = z.enum([
  'en', // English
  'fr', // French
  'es', // Spanish
  'nl', // Dutch
  'de', // German
])

export const zPlaidClientConfig = z.object({
  clientId: z.string(),
  secrets: z.record(zPlaidEnvName, z.string()),
})

export const zWebhook = zCast<WebhookShape>()

/**
 * Consider using open API version to give us more control over things like enum type generation
 * https://raw.githubusercontent.com/plaid/plaid-openapi/master/2020-09-14.yml
 *
 * After all, Plaid generates the api clients from OpenApi definitions anyways...
 */
export const makePlaidClient = zFunction(zPlaidClientConfig, (cfg) => {
  const fromEnv = memoize((envName: EnvName | undefined) => {
    const secret = envName && cfg.secrets[envName]
    if (!envName || !secret) {
      throw new Error(`Unable to get client envName=${envName}`)
    }
    const configuration = new Configuration({
      basePath: PlaidEnvironments[envName],
      baseOptions: {
        headers: {'PLAID-CLIENT-ID': cfg.clientId, 'PLAID-SECRET': secret},
        httpsAgent: getDefaultProxyAgent(),
      },
    })
    return new PlaidApi(configuration)
  })

  const fromToken = (token: string) => fromEnv(inferPlaidEnvFromToken(token))

  return {fromToken, fromEnv}
})
