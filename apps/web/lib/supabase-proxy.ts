import {backendEnv} from '@usevenice/app-config/backendConfig'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {makeJwtClient} from '@usevenice/engine-backend'
import {DateTime, joinPath} from '@usevenice/util'
import {createProxy} from 'http-proxy'
import type {NextApiRequest, NextApiResponse} from 'next'
import {respondToCORS, serverGetUserId} from '../server'

// TODO: Centralize this
const jwtClient = makeJwtClient({
  secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY!,
})

const proxy = createProxy()

export async function proxySupabase(
  {req, res}: {req: NextApiRequest; res: NextApiResponse},
  targetPath: string,
) {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }
  const [userId, method] = await serverGetUserId({req, res})

  if (!userId) {
    res.status(401).json({error: `Invalid ${method}`})
    return
  }

  const exp = DateTime.local().plus({seconds: 60}).toMillis() / 1000 // No request will be longer than 60 seconds
  // aud:apikey So we can check in logs if needed
  const accessToken = jwtClient.sign({sub: userId, aud: 'apikey', exp})

  return new Promise<void>((resolve, reject) => {
    proxy
      .once('proxyRes', resolve)
      .once('error', reject)
      .web(req, res, {
        changeOrigin: true,
        target: joinPath(commonEnv.NEXT_PUBLIC_SUPABASE_URL, targetPath),
        ignorePath: true,
        headers: {
          apikey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          authorization: `Bearer ${accessToken}`,
        },
      })
  })
}
