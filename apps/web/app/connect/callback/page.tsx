import '@usevenice/app-config/register.node'

import {cookies} from 'next/headers'

import {kAccessToken} from '@usevenice/app-config/constants'
import {env} from '@usevenice/app-config/env'
import type {Id} from '@usevenice/cdk-core'
import {makeNangoClient} from '@usevenice/cdk-core'
import type {FrameMessage} from '@usevenice/connect'

import {FullScreenCenter} from '@/components/FullScreenCenter'
import {serverSideHelpersFromViewer} from '@/lib-server'
import {serverComponentGetViewer} from '@/lib-server/server-component-helpers'

import {kConnectSession, zConnectSession} from '../init/route'
import {CallbackEffect} from './CallbackEffect'

export const metadata = {
  title: 'Venice Oauth Callback',
}

/**
 * Workaround for searchParams being empty on production. Will ahve to check
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function ConnectCallback({
  searchParams,
}: {
  // Only accessible in PageComponent rather than layout component
  // @see https://github.com/vercel/next.js/issues/43704
  searchParams: Record<string, string | string[] | undefined>
}) {
  const msg = await (async (): Promise<FrameMessage> => {
    try {
      const cookie = cookies().get(kConnectSession)
      if (!cookie) {
        return {
          type: 'ERROR',
          data: {code: 'BAD_REQUEST', message: 'No session found'},
        }
      }
      const session = zConnectSession.parse(JSON.parse(cookie.value))
      const viewer = await serverComponentGetViewer({
        searchParams: {[kAccessToken]: session.token},
      })

      const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
      const res = await nango.doOauthCallback(searchParams)

      if (res.eventType !== 'AUTHORIZATION_SUCEEDED') {
        return {
          type: 'ERROR',
          data: {code: res.data.authErrorType, message: res.data.authErrorDesc},
        }
      }

      const resourceId = res.data.connectionId as Id['reso']
      if (session.resourceId !== resourceId) {
        console.warn('Revoking due to unmatched resourceId')
        await nango.delete('/connection/{connection_id}', {
          path: {connection_id: res.data.connectionId},
          query: {provider_config_key: res.data.providerConfigKey},
        })
        return {
          type: 'ERROR',
          data: {
            code: 'FORBIDDEN',
            message: `Session resourceId (${session.resourceId}) not matching connecte resourceId ${resourceId}`,
          },
        }
      }

      const {caller} = serverSideHelpersFromViewer(viewer)
      await caller.postConnect([res.data, res.data.providerConfigKey, {}])
      return {
        type: 'SUCCESS',
        data: {resourceId: res.data.connectionId as Id['reso']},
      }
    } catch (err) {
      return {
        type: 'ERROR',
        data: {code: 'INTERNAL_SERVER_ERROR', message: `${err}`},
      }
    }
  })()

  console.log('[oauth] callback result', msg)

  // How do we do redirect here?
  return (
    <FullScreenCenter>
      <span className="mb-2">{msg.type} </span>
      <span className="mb-2">
        {msg.type === 'ERROR'
          ? `[${msg.data.code}] ${msg.data.message}`
          : msg.data.resourceId}
      </span>
      <CallbackEffect msg={msg} />
    </FullScreenCenter>
  )
}
