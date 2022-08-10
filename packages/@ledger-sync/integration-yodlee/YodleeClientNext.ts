import {
  createHTTPClient,
  HTTPError,
  memoize,
  stringifyQueryParams,
  z,
  zFunction,
} from '@ledger-sync/util'
import {
  YodleeAccount,
  YodleeTransaction,
  zGetTransactionParams,
} from './yodlee-utils'

export const zProvider = z
  .object({
    id: z.number(),
    name: z.string(),
    loginUrl: z.string(),
    baseUrl: z.string(),
    favicon: z.string(),
    /** Should be a url already */
    logo: z.string(),
    status: z.string(),
    isAutoRefreshEnabled: z.boolean(),
    authType: z.string(),
    lastModified: z.string(),
    languageISOCode: z.string(),
    primaryLanguageISOCode: z.string(),
    countryISOCode: z.string(),
  })
  .nullish()
const zProviderAccount = z.object({
  aggregationSource: z.string(),
  createdDate: z.string(),
  dataset: z.array(z.any()), // TODO: Change it with Yodlee.Dataset
  id: z.number(),
  isManual: z.boolean(),
  providerId: z.number(),
  status: z.enum([
    'LOGIN_IN_PROGRESS',
    'USER_INPUT_REQUIRED',
    'IN_PROGRESS',
    'PARTIAL_SUCCESS',
    'SUCCESS',
    'FAILED',
  ]),
  isDeleted: z.boolean().nullish(),
})

const zUser = z.object({
  id: z.number(),
  loginName: z.string(),
  roleType: z.string(),
  preferences: z.object({
    /** 'USD' */ currency: z.string(),
    /** 'PST' */ timeZone: z.string(),
    /** 'MM/dd/yyyy' */ dateFormat: z.string(),
  }),
  email: z.string(),
})
const zAccessToken = z.object({
  accessToken: z.string(),
  issuedAt: z.string(),
  expiresIn: z.number(), // seconds
})
export const zEnvName = z.enum(['sandbox', 'development', 'production'])
export const zYodleeConfig = z.object({
  envName: zEnvName,
  loginName: z.string(),
  providerAccount: zProviderAccount.nullish(),
  provider: zProvider,
  config: z.object({
    adminLoginName: z.string().nullish(),
    clientId: z.string(),
    clientSecret: z.string(),
  }),
  user: zUser.nullish(),
  accessToken: zAccessToken.nullish(),
})
type YodleeId = number | string | Array<number | string>
type EnvName = z.infer<typeof zEnvName>
const zRegisterUserInput = zUser.merge(z.object({envName: zEnvName}))

function idToString(id: YodleeId) {
  return Array.isArray(id) ? id.join(',') : id.toString()
}
export const makeYodleeClient = zFunction(zYodleeConfig, (cfg) => {
  function defaultUrl(envName: EnvName) {
    switch (envName) {
      case 'sandbox':
        return 'https://sandbox.api.yodlee.com/ysl'
      case 'development':
        return 'https://development.api.yodlee.com/ysl'
      case 'production':
        return 'https://production.api.yodlee.com/ysl'
    }
  }
  const fromEnv = memoize(
    (envName: EnvName | undefined, accessToken?: string) => {
      if (!envName) {
        throw new Error(`Unable to get client envName=${envName}`)
      }

      return createHTTPClient({
        baseURL: defaultUrl(envName),
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
          'Api-Version': '1.1',
        },

        requestTransformer: (req) => {
          if (req.headers['Authorization'] != null) {
            return req
          }

          if (cfg.accessToken) {
            req.headers = {
              ...req.headers,
              Authorization: `Bearer ${cfg.accessToken.accessToken}`,
            }
          }
          if (accessToken) {
            req.headers = {
              ...req.headers,
              Authorization: `Bearer ${accessToken}`,
            }
          }
          return req
        },

        errorTransformer: (err) => {
          if (err.response && err.response.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new YodleeError(err.response.data as any, err)
          }
          return err
        },
      })
    },
  )

  async function getHoldings(
    params: Yodlee.GetHoldingsParams,
    envName: EnvName,
  ) {
    // Adding include=assetClassification causes crash https://share.getcloudapp.com/geuz4Ndg
    // if (params.include === undefined) {
    //   params.include = 'assetClassification'
    // }
    return fromEnv(envName)
      .get<{holding?: Yodlee.Holding[]}>(`/holdings`, {params})
      .then((r) => r.data.holding || [])
  }

  async function getHoldingSecurities(
    params: {holdingId: YodleeId},
    envName: EnvName,
  ) {
    params.holdingId = idToString(params.holdingId)
    return fromEnv(envName)
      .get<{holding?: Yodlee.HoldingSecurity[]}>(`/holdings/securities`, {
        params,
      })
      .then((r) => r.data.holding || [])
  }

  return {
    generateAccessToken: zFunction(
      z.object({
        loginName: z.string(),
        envName: zEnvName,
      }),
      async ({envName, loginName}) =>
        createHTTPClient({
          baseURL: defaultUrl(envName),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Api-Version': '1.1',
            loginName,
          },
        })
          .post<{token: z.infer<typeof zAccessToken>}>(
            '/auth/token',
            stringifyQueryParams({
              clientId: cfg.config.clientId,
              secret: cfg.config.clientSecret,
            }),
          )
          .then((r) => r.data.token),
    ),

    getAccounts: zFunction(
      z.object({
        providerAccountId: z.union([z.number(), z.string()]),
        envName: zEnvName,
        accessToken: z.string().optional(),
      }),
      (opts) =>
        fromEnv(opts.envName, opts.accessToken)
          .get<{account: [YodleeAccount]}>('/accounts', {
            params: {providerAccountId: opts.providerAccountId},
          })
          .then((r) => r.data.account || []),
    ),
    getHoldingsWithSecurity: zFunction(
      z.object({
        envName: zEnvName,
        params: z.object({
          accountId: z.string().nullish(),
          providerAccountId: z.string().nullish(),
          include: z.literal('assetClassification').nullish(),
        }),
      }),
      async (opts) => {
        const holdings = await getHoldings(
          opts.params as Yodlee.GetHoldingsParams,
          opts.envName,
        )
        const holdingSecurities =
          holdings.length === 0
            ? await getHoldingSecurities(
                {holdingId: holdings.map((h) => h.id)},
                opts.envName,
              )
            : []

        return holdings.map((h: Yodlee.HoldingWithSecurity) => ({
          ...h,
          security: holdingSecurities.find((hs) => hs.id === hs.id)?.security,
        }))
      },
    ),
    getTransactions: zFunction(
      z.object({
        params: zGetTransactionParams,
        envName: zEnvName,
      }),
      (opts) =>
        fromEnv(opts.envName)
          .get<{transaction: YodleeTransaction[]}>(`/transactions`, {
            params: opts.params,
          })
          .then((r) => r.data.transaction || []),
    ),
    registerUser: zFunction(zRegisterUserInput, async ({envName, ...user}) => {
      const token = (await makeYodleeClient(cfg).generateAccessToken({
        envName: cfg.envName,
        loginName: cfg.config.adminLoginName ?? cfg.loginName,
      })) as z.infer<typeof zAccessToken>
      return fromEnv(envName)
        .post<{user: z.infer<typeof zUser>}>(
          '/user/register',
          {user},
          {headers: {Authorization: `Bearer ${token.accessToken}`}},
        )
        .then((r) => r.data.user)
    }),

    getUser: zFunction(zEnvName, (envName) =>
      fromEnv(envName)
        .get<{user: z.infer<typeof zUser>}>('/user')
        .then((r) => r.data.user)
        .catch((err) => {
          if (err instanceof YodleeError && err.data.errorCode === 'Y008') {
            throw new YodleeNotFoundError({
              entityName: 'User',
              entityId: cfg.loginName ?? '',
            })
          }
          throw err
        }),
    ),
  }
})

class YodleeError extends Error {
  override name = 'YodleeError'

  constructor(
    public readonly data: {
      errorCode: string // "Y804",
      errorMessage: string // "Permitted values of top between 1 - 500",
      referenceCode: string // "u1455707934756c4F23u"
    },
    public readonly originalError: HTTPError,
  ) {
    super(`[${data.errorCode}] ${data.errorMessage}`)
    Object.setPrototypeOf(this, YodleeError.prototype)
  }
}
class YodleeNotFoundError extends Error {
  override name = 'YodleeNotFoundError'

  constructor(
    public readonly data: {
      entityName:
        | 'User'
        | 'Account'
        | 'Provider'
        | 'ProviderAccount'
        | 'Transaction'
        | 'Holdings'
      entityId: string
    },
  ) {
    super(`${data.entityName} not found`)
    Object.setPrototypeOf(this, YodleeNotFoundError.prototype)
  }
}
