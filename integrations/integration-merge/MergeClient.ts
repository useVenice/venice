import type {InfoFromEndpoints, InfoFromPaths} from '@usevenice/util'
import {Endpoints, makeOpenApiClient, z} from '@usevenice/util'
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

export const integrationsEndpoints = {
  post: {
    '/create-link-token': {
      input: {
        body: z.object({
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
    '/account-token/{public_token}': {
      input: {path: z.object({public_token: z.string()})},
      output: z.object({account_token: z.string()}),
    },
  },
} satisfies Endpoints

export function makeMergeClient(opts: {apiKey: string; accountToken?: string}) {
  const baseUrl = 'https://api.merge.dev/api'
  const accounting = makeOpenApiClient<InfoFromPaths<paths>>({
    baseUrl: baseUrl + '/accounting/v1',
    bearerToken: opts.apiKey,
    headers: {
      ...(opts.accountToken && {'X-Account-Token': `${opts.accountToken}`}),
    },
  })
  const integrations = makeOpenApiClient<
    InfoFromEndpoints<typeof integrationsEndpoints>
  >({
    baseUrl: baseUrl + '/integrations',
    bearerToken: opts.apiKey,
  })
  return {accounting, integrations}
}
