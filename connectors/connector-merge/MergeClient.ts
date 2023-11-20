import type {Endpoints, InfoFromEndpoints, InfoFromPaths} from '@usevenice/util'
import {makeOpenApiClient, z} from '@usevenice/util'

import type {paths} from './merge.accounting.gen'

export const zCategory = z.enum([
  'hris',
  'ats',
  'accounting',
  'ticketing',
  'crm',
  'mktg',
  'filestorage',
])

export const zIntegration = z.object({
  /* ["accounting"] */
  categories: z.array(zCategory),
  /** e.g. '#0FD46C' */
  color: z.string(),
  /** 'https://merge-api-production.s3.amazonaws.com/media/Quickbooks_Logo.png', */
  image: z.string().url(),
  /** 'QuickBooks Online' */
  name: z.string(),
  /** quickbooks-online */
  slug: z.string(),
  /** 'https://merge-api-production.s3.amazonaws.com/media/QuickBooks_Square_Logo.png' */
  square_image: z.string().url(),
})

export const integrationsEndpoints = {
  get: {
    '/': {input: {}, output: z.array(zIntegration)},
    '/account-token/{public_token}': {
      input: {path: z.object({public_token: z.string()})},
      output: z.object({account_token: z.string(), integration: zIntegration}),
    },
  },
  post: {
    '/create-link-token': {
      input: {
        bodyJson: z.object({
          /** Unique ID for your end user */
          end_user_origin_id: z.string(),
          end_user_organization_name: z.string(),
          end_user_email_address: z.string(),
          categories: z.array(zCategory),
          integration: z.string().nullish(),
        }),
      },
      output: z.object({
        link_token: z.string(),
        integration_name: z.string().nullish(),
      }),
    },
  },
} satisfies Endpoints

export function makeMergeClient(opts: {apiKey: string; accountToken?: string}) {
  const baseUrl = 'https://api.merge.dev/api'
  const accounting = makeOpenApiClient<InfoFromPaths<paths>>({
    baseUrl: baseUrl + '/accounting/v1',
    auth: {bearerToken: opts.apiKey},
    headers: {
      ...(opts.accountToken && {'X-Account-Token': `${opts.accountToken}`}),
    },
  })
  const integrations = makeOpenApiClient<
    InfoFromEndpoints<typeof integrationsEndpoints>
  >({
    baseUrl: baseUrl + '/integrations',
    auth: {bearerToken: opts.apiKey},
  })
  return {accounting, integrations}
}
