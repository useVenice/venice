import {backendEnv} from '@usevenice/app-config/backendConfig'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {makeJwtClient} from '@usevenice/engine-backend'
import {DateTime, joinPath} from '@usevenice/util'
import {createProxy} from 'http-proxy'
import type {NextApiRequest, NextApiResponse} from 'next'
import {respondToCORS, serverGetUser} from '../server'

export async function proxySupabase(
  {req, res}: {req: NextApiRequest; res: NextApiResponse},
  targetPath: string,
) {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }
  const [user] = await serverGetUser({req, res})
  if (!user) {
    res.status(401)
    return
  }

  const transientToken = makeJwtClient({
    secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY!,
  }).sign({
    sub: user.id,
    aud: 'apikey', // So we can check in logs if needed
    exp: DateTime.local().plus({seconds: 60}).toMillis() / 1000, // No request will be longer than 60 seconds
  })

  const proxy = createProxy()
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
          authorization: `Bearer ${transientToken}`,
        },
      })
  })
}
