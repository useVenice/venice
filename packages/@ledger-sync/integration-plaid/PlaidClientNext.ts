// Not sure why ../node_modules import needed... was working before
import {
  castIs,
  getDefaultProxyAgent,
  memoize,
  z,
  zCast,
  zFunction,
} from '@ledger-sync/util'
import {
  AccountsGetRequest,
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
  TransactionsGetRequest,
  TransactionsSyncRequest,
} from 'plaid'
import {inferPlaidEnvFromToken} from './plaid-utils'

type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])
export const zCountryCode = z.nativeEnum(CountryCode)
export const zProducts = z.nativeEnum(Products)

export const zPlaidClientConfig = z.object({
  client_id: z.string(),
  public_key: z.string(),
  secrets: z
    .record(z.string())
    .refine(castIs<Partial<{[K in EnvName]: string}>>()),
})

export const makePlaidClient = zFunction(zPlaidClientConfig, (cfg) => {
  const fromEnv = memoize((envName: EnvName | undefined) => {
    const secret = envName && cfg.secrets[envName]
    if (!envName || !secret) {
      throw new Error(`Unable to get client envName=${envName}`)
    }
    const configuration = new Configuration({
      basePath: PlaidEnvironments[envName],
      baseOptions: {
        headers: {'PLAID-CLIENT-ID': cfg.client_id, 'PLAID-SECRET': secret},
        httpsAgent: getDefaultProxyAgent(),
      },
    })
    return new PlaidApi(configuration)
  })

  const fromToken = (token: string) =>
    fromEnv(inferPlaidEnvFromToken(token) ?? undefined)

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
  }
})
