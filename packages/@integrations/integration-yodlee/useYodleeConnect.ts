import type {UseConnectHook} from '@usevenice/cdk-core'
import {CANCELLATION_TOKEN, DivContainer, useScript} from '@usevenice/cdk-core'
import type {NonDiscriminatedUnion} from '@usevenice/util'

import type {FastLinkOpenOptions} from './fastlink'
import type {yodleeProviderDef} from './YodleeProvider'

const YODLEE_CONTAINER_ID = 'yodlee-container'

export const useYodleeConnect: UseConnectHook<typeof yodleeProviderDef> = (
  scope,
) => {
  const loaded = useScript('//cdn.yodlee.com/fastlink/v4/initialize.js')
  console.log('[yodlee] useConnectHook')

  return async (
    {accessToken},
    {
      envName,
      connectionExternalId: providerAccountId,
      institutionExternalId: providerId,
    },
  ) => {
    console.log('[yodlee] connect', {
      accessToken,
      envName,
      providerId,
      providerAccountId,
    })
    await loaded

    console.log('[yodlee] script loaded, will open dialog')

    return new Promise((resolve, reject) => {
      scope.openDialog(({close}) => {
        const openOptions: FastLinkOpenOptions = {
          fastLinkURL: {
            sandbox:
              'https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink',
            development:
              'https://fl4.preprod.yodlee.com/authenticate/development-75/fastlink/?channelAppName=tieredpreprod',
            production:
              'https://fl4.prod.yodlee.com/authenticate/production-148/fastlink/?channelAppName=tieredprod',
          }[envName],
          accessToken: `Bearer ${accessToken.accessToken}`,
          forceIframe: true,
          params: {
            configName: 'Aggregation',
            ...(providerAccountId
              ? {flow: 'edit', providerAccountId}
              : providerId
              ? {flow: 'add', providerId}
              : undefined),
          },
          onSuccess: (data) => {
            console.debug('[yodlee] Did receive successful response', data)
            close()
            resolve({
              providerAccountId: data.providerAccountId,
              providerId: data.providerId,
            })
          },
          onError: (_data) => {
            console.warn('[yodlee] Did receive an error', _data)
            const data = _data as NonDiscriminatedUnion<typeof _data>
            close()
            reject(new Error(data.reason ?? data.message))
          },
          onClose: (data) => {
            console.log('[yodlee] Did close', data)
            close()
            reject(CANCELLATION_TOKEN)
          },
          onEvent: (data) => {
            console.log('[yodlee] event', data)
          },
        }
        console.log('[yodlee] Open options', openOptions)
        return DivContainer({
          id: YODLEE_CONTAINER_ID,
          onMount: () =>
            window.fastlink?.open(openOptions, YODLEE_CONTAINER_ID),
          onUnmount: () => window.fastlink?.close(),
        })
      })
    })
  }
}
