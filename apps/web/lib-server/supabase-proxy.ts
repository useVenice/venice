import {backendEnv} from '@usevenice/app-config/backendConfig'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {
  kAcceptUrlParam,
  kApikeyHeader,
  kApikeyUrlParam,
} from '@usevenice/app-config/constants'
import {makeJwtClient} from '@usevenice/cdk-core'
import {parseUrl, stringifyUrl} from '@usevenice/util'
import {createProxy} from 'http-proxy'
import type {NextApiRequest, NextApiResponse} from 'next'
import type {IncomingMessage} from 'node:http'
import {respondToCORS, serverGetViewer} from '.'

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
  const viewer = await serverGetViewer({req, res})
  if (viewer.role !== 'user') {
    res.status(401).send('Unauthorized')
    return
  }

  // aud:apikey So we can check in logs if needed
  const accessToken = jwtClient.signViewer(viewer)

  await Promise.all([
    onUserId?.(viewer.userId),
    new Promise((resolve, reject) => {
      proxy
        // Do not pass our custom param onwards otherwise could cause pgRest to complain
        // plus better for security (in case of apiKey)
        .on('proxyReq', function (proxyReq) {
          const parsed = parseUrl(proxyReq.path)
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete parsed.query[kApikeyUrlParam]
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete parsed.query[kAcceptUrlParam]
          proxyReq.path = stringifyUrl(parsed)
          proxyReq.removeHeader(kApikeyHeader)
        })
        .once('proxyRes', (proxyRes) => {
          if (proxyRes.headers['content-type']?.startsWith('text/csv')) {
            // Make it easier to debug in chrome
            // Tried the content-disposition = inline approach but it didn't work
            // So we just delete the content-type header for now
            // https://stackoverflow.com/questions/67810068/open-url-with-content-type-text-csv-in-browser-at-least-chrome-without-downloa
            delete proxyRes.headers['content-type']
          }

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
            // Technically this is only for pgREST. However it's not as convenient to
            // handle this within [[...rest]].page for now so we do it here.
            // @see https://postgrest.org/en/stable/api.html?highlight=csv#response-format
            ...(req.query[kAcceptUrlParam] === 'csv' && {accept: 'text/csv'}),
          },
        })
    }),
  ])
}
