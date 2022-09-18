import type {
  AccountsGetRequest,
  InstitutionsGetByIdRequest,
  InstitutionsGetRequest,
  ItemPublicTokenExchangeRequest,
  ItemWebhookUpdateRequest,
  LinkTokenCreateRequest,
  SandboxItemFireWebhookRequest,
  SandboxItemResetLoginRequest,
  TransactionsGetRequest,
  TransactionsSyncRequest,
} from 'plaid'
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
} from '@ledger-sync/util'

import {inferPlaidEnvFromToken} from './plaid-utils'
import type {WebhookShape} from './plaid.types'

type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])
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
  secrets: z.record(zEnvName, z.string()),
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

  const getData = <T>(r: {data: T}) => r.data

  return {
    linkTokenCreate: zFunction(
      [zEnvName, zCast<LinkTokenCreateRequest>()],
      (env, opts) => fromEnv(env).linkTokenCreate(opts).then(getData),
    ),
    itemPublicTokenExchange: zFunction(
      zCast<ItemPublicTokenExchangeRequest>(),
      (opts) =>
        fromToken(opts.public_token)
          .itemPublicTokenExchange(opts)
          .then(getData),
    ),
    itemGet: zFunction(z.string(), (access_token) =>
      fromToken(access_token).itemGet({access_token}).then(getData),
    ),
    itemRemove: zFunction(z.string(), async (access_token) =>
      fromToken(access_token).itemRemove({access_token}).then(getData),
    ),
    accountsGet: zFunction(zCast<AccountsGetRequest>(), (opts) =>
      fromToken(opts.access_token).accountsGet(opts).then(getData),
    ),
    transactionsGet: zFunction(zCast<TransactionsGetRequest>(), (opts) =>
      fromToken(opts.access_token).transactionsGet(opts).then(getData),
    ),
    transactionsSync: zFunction(zCast<TransactionsSyncRequest>(), (opts) =>
      fromToken(opts.access_token).transactionsSync(opts).then(getData),
    ),
    institutionsGetById: zFunction(
      [zEnvName, zCast<InstitutionsGetByIdRequest>()],
      (envName, opts) =>
        fromEnv(envName).institutionsGetById(opts).then(getData),
    ),
    institutionsGet: zFunction(
      [zEnvName, zCast<InstitutionsGetRequest>()],
      (envName, opts) => fromEnv(envName).institutionsGet(opts).then(getData),
    ),
    itemWebhookUpdate: zFunction(zCast<ItemWebhookUpdateRequest>(), (opts) =>
      fromToken(opts.access_token).itemWebhookUpdate(opts).then(getData),
    ),
    sandboxItemFireWebhook: zFunction(
      zCast<SandboxItemFireWebhookRequest>(),
      (opts) =>
        fromToken(opts.access_token).sandboxItemFireWebhook(opts).then(getData),
    ),
    sandboxItemResetLogin: zFunction(
      zCast<SandboxItemResetLoginRequest>(),
      (opts) =>
        fromToken(opts.access_token).sandboxItemResetLogin(opts).then(getData),
    ),
  }
})
