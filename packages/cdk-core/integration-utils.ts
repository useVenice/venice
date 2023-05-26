import {z} from '@usevenice/util'

export const zIntOauth = z.object({
  apikeyAuth: z.boolean().optional().describe('API key auth support'),
  oauth: z
    .union([
      z.null().describe('No oauth'),
      z
        .object({
          clientId: z.string(),
          clientSecret: z.string(),
        })
        .describe('Configure oauth'),
    ])
    .optional()
    .describe('Oauth support'),
})

export const zIntApiKeyAuth = z.object({
  apikeyAuth: z.boolean().optional().describe('API key auth support'),
})

export const zIntOauthApikeyAuth = zIntOauth.merge(zIntApiKeyAuth)
