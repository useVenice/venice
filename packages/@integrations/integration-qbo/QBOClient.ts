import {
  createHTTPClient,
  DateTime,
  OAuth2Client,
  z,
  zCast,
  zFunction,
} from '@usevenice/util'

export const zConfig = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  /** For proxies */
  url: z.string().nullish(),
  /** For webhooks */
  verifierToken: z.string().nullish(),
})

export const zCreds = z.object({
  sandbox: z.boolean().nullish(),
  realmId: z.string(),
  refreshToken: z.string(),
  accessToken: z.string().nullish(),
  accessTokenExpiresAt: z.string().nullish(), // ISODateTime
  /** Informational for nwo.  */
  refreshTokenExpiresAt: z.string().nullish(), // ISODateTime
})

export const makeQBOClient = zFunction([zConfig, zCreds], (config, creds) => {
  const apiHost =
    config.url ??
    (creds.sandbox
      ? 'https://sandbox-quickbooks.api.intuit.com'
      : 'https://quickbooks.api.intuit.com')

  function oauth2(config: {clientId: string; clientSecret: string}) {
    return new OAuth2Client<QBOOAuthTypes['error'], QBOOAuthTypes['tokens']>({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authorizeURL: 'https://appcenter.intuit.com/connect/oauth2',
      tokenURL: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      revokeUrl: 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke',
      clientAuthLocation: 'header',
      errorToString: (err) =>
        err.error_description
          ? `${err.error}: ${err.error_description}`
          : err.error,
    })
  }

  function parseTokens(tokens: QBOOAuthTypes['tokens']) {
    // TODO: Use intuit returned Date in header if we could. Looks like
    // Date: Wed, 12 Aug 2020 14:25:39 GMT
    // Need access to header also here
    const now = DateTime.utc()
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      accessTokenExpiresAt: now.plus({seconds: tokens.expires_in}).toISO(),
      refreshTokenExpiresAt: now
        .plus({seconds: tokens.x_refresh_token_expires_in})
        .toISO(),
    }
  }

  const http = createHTTPClient({
    baseURL: `${apiHost}/v3/company/${creds.realmId}/`,
    headers: {'Content-Type': 'application/json'},
    requestTransformer: (req) => {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${creds.accessToken}`,
      }
      return req
    },
    errorTransformer: (err) =>
      // if (err.response && err.response.data) {
      //   return new YodleeError(err.response.data, err)
      // }
      err,
    refreshAuth: {
      shouldProactiveRefresh: () =>
        creds.accessTokenExpiresAt
          ? // Proactive refresh within 30 mins.
            DateTime.fromISO(creds.accessTokenExpiresAt) >=
            DateTime.utc().minus({minutes: 30})
          : false,
      refresh: () =>
        oauth2(config)
          .refreshToken(creds.refreshToken)
          .then((res) => {
            Object.assign(creds, parseTokens(res))
          }),
    },
  })

  /** Prefix id with realmId to get id global within QBO provider */
  function globalId(id: string) {
    return `${creds.realmId}_${id}`
  }

  const query = zFunction(z.string(), async (query) =>
    http.get<QBO.QueryPayload>('query', {params: {query}}).then((r) => r.data),
  )

  async function* getAll<T extends QBO.EntityName>(
    entityName: T,
    /** Range is inclusive */
    params: {updatedSince?: ISODateTime} = {},
  ) {
    let startPosition = 1 // QBO is 1 index based
    // Fetch 100 transactions only on the first request to optimize for incremental
    // sync scenarios
    let maxResults = 100
    while (true) {
      const res = await query(
        `SELECT * FROM ${entityName} ${
          params.updatedSince
            ? `WHERE MetaData.LastUpdatedTime >='${params.updatedSince}'`
            : ''
        } ORDERBY MetaData.LastUpdatedTime DESC
         STARTPOSITION ${startPosition} MAXRESULTS ${maxResults}`,
      )

      const entities = res.QueryResponse[entityName] ?? []
      yield {
        // Hack needed for some reason
        entities: entities as Exclude<typeof entities, never[]>,
        startPosition,
        maxResults,
      }
      if (entities.length === 0) {
        break
      }
      startPosition += entities.length
      maxResults = 500 // Then fetch 500 fo efficiency
    }
  }

  return {
    globalId,
    query,
    read: zFunction(
      [zCast<QBO.EntityName>(), z.union([z.string(), z.number()])],
      async (entityName, id) =>
        http.get(`${entityName}/${id}`).then((r) => r.data),
    ),
    count: zFunction(zCast<QBO.EntityName>(), async (entity) =>
      query(`SELECT count(*) FROM ${entity}`).then(
        (r) => r.QueryResponse.totalCount ?? -1,
      ),
    ),
    getAll,
    getChangeDataCapture: zFunction(
      z.object({
        entities: zCast<QBO.EntityName[]>(),
        changedSince: z.string(),
      }),
      async (params) =>
        http
          .get<QBO.CDCPayload>('cdc', {
            params: {...params, entities: params.entities.join(',')},
          })
          .then((r) => r.data),
    ),
    getCompanyInfo: zFunction(async () =>
      http
        .get<QBO.GetCompanyInfoPayload>(`companyinfo/${creds.realmId}`)
        .then((r) => r.data),
    ),
    getPreferences: zFunction(async () =>
      http.get('preferences').then((r) => r.data),
    ),
    reportTransactionsList: zFunction(async () =>
      http
        .get<QBO.ReportPayload>('reports/TransactionList')
        .then((r) => r.data),
    ),
    revokeAccessToken: zFunction(async () => {
      const oauth = oauth2(config)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const res = await oauth.revokeToken(creds.accessToken!)
      return res
    }),

    refreshAccessToken: zFunction(async () => {
      const oauth = oauth2(config)
      const res = await oauth.refreshToken(creds.refreshToken)
      creds.accessToken = res.access_token
      return res
    }),
    SCOPES: {
      accounting: 'com.intuit.quickbooks.accounting',
      payment: 'com.intuit.quickbooks.payment',
      payroll: 'com.intuit.quickbooks.payroll',
      timetracking: 'com.intuit.quickbooks.payroll.timetracking',
      benefits: 'com.intuit.quickbooks.payroll.benefits',
    },
  }
})

interface QBOOAuthTypes {
  error: {error: string; error_description?: string}
  tokens: {
    access_token: string
    expires_in: number
    refresh_token: string
    token_type: 'bearer'
    x_refresh_token_expires_in: number
  }
}
