import {setCookie} from 'cookies-next'
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

import {kAccessToken} from '@usevenice/app-config/constants'
import {env} from '@usevenice/app-config/env'
import type {IntegrationDef} from '@usevenice/cdk-core'
import {
  extractProviderName,
  getViewerId,
  makeId,
  makeNangoClient,
  zId,
} from '@usevenice/cdk-core'
import {zConnectPageParams} from '@usevenice/engine-backend/router/endUserRouter'
import {makeUlid, z} from '@usevenice/util'

import {defIntegrations} from '@/../app-config/integrations/integrations.def'
import {withErrorHandler} from '@/lib-server'
import {serverComponentGetViewer} from '@/lib-server/server-component-helpers'

export const kConnectSession = 'connect-session'

type ConnectSession = z.infer<typeof zConnectSession>
export const zConnectSession = z.object({
  token: z.string(),
  resourceId: zId('reso'),
})

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const params = zConnectPageParams
      .required({integrationId: true})
      .parse(Object.fromEntries(req.nextUrl.searchParams.entries()))

    const viewer = await serverComponentGetViewer({
      searchParams: {[kAccessToken]: params.token},
    })

    if (viewer.role !== 'end_user') {
      throw new Error(
        `Authenticated user only. Your role is ${getViewerId(viewer)}`,
      )
    }
    if (!params.integrationId) {
      throw new Error('Missing integrationId')
    }

    const providerName = extractProviderName(params.integrationId)
    const intDef = defIntegrations[
      providerName as keyof typeof defIntegrations
    ] as IntegrationDef

    if (!intDef.metadata?.nangoProvider) {
      throw new Error('/connect/init is only supported for oauth providers')
    }

    const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
    const resourceId = makeId('reso', providerName, makeUlid())
    const url = await nango.getOauthConnectUrl({
      public_key: env.NEXT_PUBLIC_NANGO_PUBLIC_KEY,
      connection_id: resourceId,
      provider_config_key: params.integrationId,
      // Consider using hookdeck so we can work with any number of urls
      // redirect_uri: joinPath(getServerUrl(null), '/connect/callback'),
    })
    const res = NextResponse.redirect(url)
    setCookie(
      kConnectSession,
      JSON.stringify({
        resourceId,
        token: params.token,
      } satisfies ConnectSession),
      // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7%7Cthe
      // Need sameSite to be lax in order for this to work
      {req, res, secure: true, sameSite: 'lax', maxAge: 3600}, // Expire cookie so we clean ourselves up
    )
    return res
  })
}
