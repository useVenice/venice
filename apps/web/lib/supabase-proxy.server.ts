import {backendEnv} from '@usevenice/app-config/backendConfig'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {xPatHeaderKey, xPatUrlParamKey} from '@usevenice/app-config/constants'
import {makeJwtClient} from '@usevenice/engine-backend'
import {DateTime, parseUrl, stringifyUrl} from '@usevenice/util'
import type {IncomingMessage} from 'node:http'
import {createProxy} from 'http-proxy'
import type {NextApiRequest, NextApiResponse} from 'next'
import {respondToCORS, serverGetApiUserId} from '../server'

// TODO: Centralize this
const jwtClient = makeJwtClient({
  secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY!,
})

const proxy = createProxy()

export async function proxySupabase({
  req,
  res,
  targetPath,
  onUserId,
  onProxyRes,
}: {
  req: NextApiRequest
  res: NextApiResponse
  targetPath: string
  onUserId?: (userId: string | null | undefined) => unknown
  onProxyRes?: (proxyRes: IncomingMessage) => void
}) {
  // Is this necessary? Or should we let the proxied endpoints determine this?
  if (respondToCORS(req, res)) {
    return
  }
  const [userId] = await serverGetApiUserId({req, res})

  // aud:apikey So we can check in logs if needed
  const accessToken =
    userId &&
    jwtClient.sign({
      sub: userId,
      aud: 'apikey',
      exp: DateTime.local().plus({seconds: 60}).toMillis() / 1000, // No request will be longer than 60 seconds
    })

  await Promise.all([
    onUserId?.(userId),
    new Promise((resolve, reject) => {
      proxy
        // Do not pass the personal access token param onwards
        .on('proxyReq', function (proxyReq) {
          const parsed = parseUrl(proxyReq.path)
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete parsed.query[xPatUrlParamKey]
          proxyReq.path = stringifyUrl(parsed)
          proxyReq.removeHeader(xPatHeaderKey)
        })
        .once('proxyRes', (proxyRes) => {
          onProxyRes?.(proxyRes)
          resolve(undefined)
        })
        .once('error', reject)
        .web(req, res, {
          changeOrigin: true,
          target: new URL(targetPath, commonEnv.NEXT_PUBLIC_SUPABASE_URL).href,
          // target: 'http://localhost:3010/api/debug',
          ignorePath: true,
          headers: {
            apikey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            ...(accessToken && {authorization: `Bearer ${accessToken}`}),
          },
        })
    }),
  ])
}
