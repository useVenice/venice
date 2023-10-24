import '@usevenice/app-config/register.node'

import {Loader2} from 'lucide-react'

import {env} from '@usevenice/app-config/env'
import type {Id} from '@usevenice/cdk-core'
import {makeNangoClient} from '@usevenice/cdk-core'

import {FullScreenCenter} from '@/components/FullScreenCenter'
import {serverSideHelpersFromViewer} from '@/lib-server'

import type {FrameMessage} from './CallbackEffect'
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
  const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
  const res = await nango.doOauthCallback(searchParams)

  const msg = await (async (): Promise<FrameMessage> => {
    if (res.eventType !== 'AUTHORIZATION_SUCEEDED') {
      return {
        type: 'ERROR',
        data: {code: res.data.authErrorType, message: res.data.authErrorDesc},
      }
    }
    try {
      const {caller} = serverSideHelpersFromViewer({role: 'system'})
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

  // How do we do redirect here?
  return (
    <FullScreenCenter>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <CallbackEffect msg={msg} />
    </FullScreenCenter>
  )
}
