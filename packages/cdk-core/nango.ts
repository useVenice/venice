import type {Endpoints, InfoFromEndpoints} from '@usevenice/util'
import {makeOpenApiClient, z} from '@usevenice/util'

const zNangoProvider = z.enum([
  'accelo',
  'adobe',
  'aircall',
  'airtable',
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

export type NangoProvider = z.infer<typeof zNangoProvider>

export const zIntegrationShort = z.object({
  provider: zNangoProvider,
  /** aka providerConfigKey */
  unique_key: z.string(),
})

export const zIntegration = zIntegrationShort.extend({
  client_id: z.string(),
  client_secret: z.string(),
  scopes: z.string(),
  app_link: z.string().nullish(),
  auth_mode: z.enum(['OAUTH2', 'OAUTH1', 'BASIC']),
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

export const endpoints = {
  get: {
    '/config': {input: {}, output: z.array(zIntegrationShort)},
    '/config/{providerConfigKey}': {
      input: {
        path: z.object({providerConfigKey: z.string()}),
        query: z.object({include_creds: z.boolean().optional()}),
      },
      output: z.union([zIntegration, zIntegrationShort]),
    },
  },
  post: {
    '/config': {input: {bodyJson: zUpsertIntegration}, output: z.undefined()},
  },
  put: {
    '/config': {input: {bodyJson: zUpsertIntegration}, output: z.undefined()},
  },
  delete: {
    '/config/{providerConfigKey}': {
      input: {path: z.object({providerConfigKey: z.string()})},
      output: z.undefined(),
    },
  },
} satisfies Endpoints

// ---

export const zNangoConfig = z.object({
  secretKey: z.string(),
})

export function makeNangoClient(config: z.infer<typeof zNangoConfig>) {
  const client = makeOpenApiClient<InfoFromEndpoints<typeof endpoints>>({
    baseUrl: 'https://api.nango.dev',
    auth: {bearerToken: config.secretKey},
  })
  return client
}

export type NangoClient = ReturnType<typeof makeNangoClient>
