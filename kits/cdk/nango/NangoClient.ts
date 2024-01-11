/** TODO: Move this into @opensdks */
import type {Endpoints, InfoFromEndpoints} from '@usevenice/util'
import {makeOpenApiClient} from '@usevenice/util'
import {z} from '@usevenice/zod'

const zNangoProvider = z.enum([
  'accelo',
  'adobe',
  'aircall',
  'airtable',
  'apollo',
  'amazon',
  'amplitude',
  'asana',
  'ashby',
  'atlassian',
  'bamboohr',
  'battlenet',
  'bitbucket',
  'boldsign',
  'box',
  'braintree',
  'braintree-sandbox',
  'brex',
  'brex-staging',
  'calendly',
  'clickup',
  'confluence',
  'contentstack',
  'deel',
  'deel-sandbox',
  'digitalocean',
  'discord',
  'docusign',
  'docusign-sandbox',
  'dropbox',
  'epic-games',
  'evaluagent',
  'eventbrite',
  'exact-online',
  'factorial',
  'facebook',
  'figjam',
  'figma',
  'fitbit',
  'freshbooks',
  'freshservice',
  'front',
  'github',
  'github-app',
  'gitlab',
  'gong',
  'google',
  'google-calendar',
  'google-mail',
  'google-sheet',
  'gorgias',
  'greenhouse',
  'gumroad',
  'gusto',
  'health-gorilla',
  'highlevel',
  'hubspot',
  'instagram',
  'intercom',
  'intuit',
  'jira',
  'keap',
  'lever',
  'linear',
  'linkedin',
  'linkhut',
  'mailchimp',
  'microsoft-teams',
  'mixpanel',
  'miro',
  'monday',
  'mural',
  'nationbuilder',
  'netsuite',
  'notion',
  'one-drive',
  'osu',
  'outreach',
  'pagerduty',
  'pandadoc',
  'payfit',
  'pennylane',
  'pipedrive',
  'qualtrics',
  'quickbooks',
  'ramp',
  'ramp-sandbox',
  'reddit',
  'ring-central',
  'ring-central-sandbox',
  'segment',
  'sage',
  'salesforce',
  'salesforce-sandbox',
  'salesloft',
  'servicem8',
  'shopify',
  'shortcut',
  'slack',
  'smugmug',
  'splitwise',
  'spotify',
  'squareup',
  'squareup-sandbox',
  'stackexchange',
  'strava',
  'stripe',
  'stripe-express',
  'survey-monkey',
  'teamwork',
  'timely',
  'trello',
  'todoist',
  'twitch',
  'twitter',
  'twitter-v2',
  'twinfield',
  'typeform',
  'uber',
  'unauthenticated',
  'wakatime',
  'wave-accounting',
  'wildix-pbx',
  'workable',
  'xero',
  'yahoo',
  'yandex',
  'youtube',
  'zapier-nla',
  'zendesk',
  'zenefits',
  'zoho',
  'zoho-books',
  'zoho-crm',
  'zoho-desk',
  'zoho-inventory',
  'zoho-invoice',
  'zoom',
])

export const zAuthMode = z.enum(['OAUTH2', 'OAUTH1', 'BASIC', 'API_KEY'])

export type NangoProvider = z.infer<typeof zNangoProvider>

export const zIntegrationShort = z.object({
  provider: zNangoProvider,
  /** aka provider_config_key */
  unique_key: z.string(),
})

export const zConnectionShort = z.object({
  /**
   * This is a very mis-leading property name. It is typically the userId. Notably this means each user would only be able
   * to connect a single connection for each provider
   */
  connection_id: z.string(),
  created: z.string().datetime(),
  /** Now this is actually the unique id for the connection */
  id: z.number(),
  provider: zNangoProvider,
})

export const zConnection = zConnectionShort.extend({
  updated_at: z.string().datetime(),
  provider_config_key: z.string(),
  credentials: z.object({
    type: zAuthMode,
    access_token: z.string(),
    refresh_token: z.string().optional(),
    expires_at: z.string().datetime(),
    raw: z.object({
      access_token: z.string(),
      expires_in: z.number(),
      expires_at: z.string().datetime(),
      /** Refresh token (Only returned if the REFRESH_TOKEN boolean parameter is set to true and the refresh token is available) */
      refresh_token: z.string().nullish(),
      refresh_token_expires_in: z.number().nullish(),
      token_type: z.string(), //'bearer',
      scope: z.string().optional(),
    }),
  }),
  connection_config: z.record(z.unknown()),
  metadata: z.record(z.unknown()).nullable(),
  credentials_iv: z.string(),
  credentials_tag: z.string(),
  environment_id: z.number(),
  deleted: z.boolean(),
  deleted_at: z.string().datetime().nullable(),
  last_fetched_at: z.string().datetime().nullable(),
})

export const zIntegration = zIntegrationShort.extend({
  client_id: z.string(),
  client_secret: z.string(),
  /** comma deliminated scopes with no spaces in between */
  scopes: z.string(),
  app_link: z.string().nullish(),
  // In practice we only use nango for oauth integrations
  // but in theory we could use it for a generic secret store as well
  auth_mode: zAuthMode,
})

export const zUpsertIntegration = zIntegration
  .omit({
    unique_key: true,
    client_id: true,
    client_secret: true,
    scopes: true,
  })
  .extend({
    provider_config_key: z.string(),
    oauth_client_id: z.string(),
    oauth_client_secret: z.string(),
    oauth_scopes: z.string().optional(),
  })
  .partial({auth_mode: true})

export type UpsertIntegration = z.infer<typeof zUpsertIntegration>

export const endpoints = {
  get: {
    '/config': {input: {}, output: z.array(zIntegrationShort)},
    '/config/{provider_config_key}': {
      input: {
        path: z.object({provider_config_key: z.string()}),
        query: z.object({include_creds: z.boolean().optional()}),
      },
      output: z.union([zIntegration, zIntegrationShort]),
    },
    '/connection': {input: {}, output: z.array(zConnectionShort)},
    '/connection/{connectionId}': {
      input: {
        path: z.object({connectionId: z.string()}),
        query: z.object({
          provider_config_key: z.string(),
          force_refresh: z.boolean().optional(),
          refresh_token: z.boolean().optional(),
        }),
      },
      output: zConnection,
    },
  },
  post: {
    '/config': {input: {bodyJson: zUpsertIntegration}, output: z.undefined()},
  },
  put: {
    '/config': {input: {bodyJson: zUpsertIntegration}, output: z.undefined()},
  },
  delete: {
    '/config/{provider_config_key}': {
      input: {path: z.object({provider_config_key: z.string()})},
      output: z.undefined(),
    },
    '/connection/{connection_id}': {
      input: {
        path: z.object({connection_id: z.string()}),
        query: z.object({
          provider_config_key: z.string(),
          force_refresh: z.boolean().optional(),
          refresh_token: z.boolean().optional(),
        }),
      },
      output: z.undefined(),
    },
  },
} satisfies Endpoints

// ---

export const zNangoConfig = z.object({
  secretKey: z.string(),
})

export const NANGO_API_HOST = 'https://api.nango.dev'

export function makeNangoClient(config: z.infer<typeof zNangoConfig>) {
  const client = makeOpenApiClient<InfoFromEndpoints<typeof endpoints>>({
    baseUrl: NANGO_API_HOST,
    auth: {bearerToken: config.secretKey},
  })

  return {
    ...client,
    getOauthConnectUrl: async ({
      redirect_uri,
      ...params
    }: {redirect_uri?: string} & z.infer<typeof zNangoOauthConnectParams>) => {
      const res = await client._fetch(buildNangoConnectUrl(params), {
        redirect: 'manual',
      })
      const location = res.headers.get('location')
      if (res.status !== 302 || !location) {
        throw new Error('Missing redirect from nango /oauth/connect response')
      }
      const url = new URL(location)
      if (redirect_uri) {
        url.searchParams.set('redirect_uri', redirect_uri)
      }
      return url.toString()
    },
    doOauthCallback: async (
      params: Record<string, string | string[] | undefined>,
    ) => {
      const url = new URL('/oauth/callback', NANGO_API_HOST)
      for (const [key, value] of Object.entries(params)) {
        const arr = Array.isArray(value) ? value : value != null ? [value] : []
        for (const v of arr) {
          url.searchParams.append(key, v)
        }
      }
      const res = await client._fetch(url.toString(), {redirect: 'manual'})
      const htmlBody = await res.text()
      return parseNangoOauthCallbackPage(htmlBody)
    },
  }
}

makeNangoClient.client = () => {}

export type NangoClient = ReturnType<typeof makeNangoClient>

export const zNangoOauthConnectParams = z
  .object({
    provider_config_key: z.string(),
    connection_id: z.string(),
    public_key: z.string(),
  })
  .passthrough()

export function buildNangoConnectUrl({
  provider_config_key,
  ...params
}: z.infer<typeof zNangoOauthConnectParams>) {
  // http://localhost:3000/connect?displayName=Spendoso&connectorConfigId=int_qbo&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTgwODM2NjgsInJvbGUiOiJlbmRfdXNlciIsInN1YiI6Im9yZ18yUEk1VU42ZDRVMTdlOHpYaTFLdDloYzg4dnMvc3BlbmRvc28tdGVzdGVyIiwiZW5kX3VzZXJfaWQiOiJzcGVuZG9zby10ZXN0ZXIiLCJvcmdfaWQiOiJvcmdfMlBJNVVONmQ0VTE3ZTh6WGkxS3Q5aGM4OHZzIiwiaWF0IjoxNjk4MDgwMDY4fQ.GNFK71PloX0LkWQ3RCaWN6KCENSQtiXwvopfQk6ymB4
  const url = new URL(`/oauth/connect/${provider_config_key}`, NANGO_API_HOST)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, `${value}`)
  }
  return url.toString()
}

export const zNangoOauthCallbackMessage = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('AUTHORIZATION_SUCEEDED'),
    data: z.object({providerConfigKey: z.string(), connectionId: z.string()}),
  }),
  z.object({
    eventType: z.literal('AUTHORIZATION_FAILED'),
    data: z.object({authErrorDesc: z.string(), authErrorType: z.string()}),
  }),
])

export function parseNangoOauthCallbackPage(html: string) {
  const parseStrVar = (name: string) =>
    html
      .match(new RegExp(`${name.replace('.', '.')} = (?:'|\`|")(.*)`))?.[1]
      ?.replace(/('|`|");?$/, '')

  const eventType = parseStrVar('message.eventType')

  const authErrorType = parseStrVar('window.authErrorType')
  const authErrorDesc = parseStrVar('window.authErrorDesc')

  const providerConfigKey = parseStrVar('window.providerConfigKey')
  const connectionId = parseStrVar('window.connectionId')

  return zNangoOauthCallbackMessage.safeParse({
    eventType,
    data: {providerConfigKey, connectionId, authErrorDesc, authErrorType},
  }).data
}
