import type {ClientOptions} from './createClient'
import {createClient} from './createClient'

export const DEFAULT_REFRESH_TOKEN_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export interface OauthTokens {
  accessToken: string
  refreshToken: string
  /** ISO string */
  expiresAt: string | null
}

export type OAuthClientOptions<Paths extends {} = {}> = ClientOptions & {
  tokens: OauthTokens
  refreshTokens: (
    client: ReturnType<typeof createOauthClient<Paths>>,
  ) => Promise<OauthTokens>
  onTokenRefreshed?: (tokens: OauthTokens) => void
}

export function createOauthClient<Paths extends {}>({
  tokens: initialTokens,
  refreshTokens,
  onTokenRefreshed,
  preRequest = (url, init) => [url, init],
  ...options
}: OAuthClientOptions<Paths>) {
  let tokens = initialTokens
  const client = createClient<Paths>({
    ...options,
    preRequest: async (url, init) => {
      // Proactive refresh access token
      if (
        !tokens.expiresAt ||
        Date.parse(tokens.expiresAt) <
          Date.now() + DEFAULT_REFRESH_TOKEN_THRESHOLD_MS
      ) {
        tokens = await refreshTokens(client)
        onTokenRefreshed?.(tokens)
      }
      return preRequest(url, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
    },
  })
  return client
}
