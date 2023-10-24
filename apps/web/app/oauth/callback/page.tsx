import '@usevenice/app-config/register.node'

import {env} from '@usevenice/app-config/env'
import {makeNangoClient} from '@usevenice/cdk-core'

import {serverSideHelpersFromViewer} from '@/lib-server'

import {CallbackPage} from './CallbackPage'

export const metadata = {
  title: 'Venice Oauth Callback',
}

/**
 * Workaround for searchParams being empty on production. Will ahve to check
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function OAuthCallback({
  searchParams,
}: {
  // Only accessible in PageComponent rather than layout component
  // @see https://github.com/vercel/next.js/issues/43704
  searchParams: Record<string, string | string[] | undefined>
}) {
  const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
  const ret = await nango.doOauthCallback(searchParams)

  if (ret.eventType === 'AUTHORIZATION_SUCEEDED') {
    const {caller} = serverSideHelpersFromViewer({role: 'system'})

    try {
      await caller.postConnect([ret.data, ret.data.providerConfigKey, {}])
    } catch (err) {
      // TODO: Better handle failure here.
      return (
        <CallbackPage
          res={{errorCode: 'INTERNAL_SERVER_ERROR', message: `${err}`}}
        />
      )
    }
  }

  // How do we do redirect here?
  return <CallbackPage res={ret} />
}
