import {useMeasure, useUpdateEffect} from '@react-hookz/web'
import {motion, useAnimation} from 'framer-motion'
import React from 'react'
import {toast} from 'react-hot-toast'

export interface YodleeFastLinkProps {
  envName: Yodlee.EnvName
  fastlinkToken: string
  providerId?: number | string
  providerAccountId?: number | string
  onSuccess?: (data: OnSuccessData) => void
  onError?: (data: OnErrorData) => void
  onClose?: (data: OnCloseData) => void
  onEvent?: (data: unknown) => void
}

export function YodleeFastLink({
  envName,
  fastlinkToken,
  providerId,
  providerAccountId,
  onSuccess,
  onError,
  onClose,
  onEvent,
}: YodleeFastLinkProps) {
  // console.log('[YodleeFastLink] render')
  React.useLayoutEffect(
    () => {
      // console.log('[YodleeFastLink] start layout effect')
      setTimeout(() => {
        // console.log('[YodleeFastLink] setTimeout runs')
        const options: FastLinkOpenOptions = {
          fastLinkURL: {
            sandbox:
              'https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink',
            development:
              'https://fl4.preprod.yodlee.com/authenticate/development-75/fastlink/?channelAppName=tieredpreprod',
            production:
              'https://fl4.prod.yodlee.com/authenticate/production-148/fastlink/?channelAppName=tieredprod',
          }[envName],
          accessToken: fastlinkToken,
          forceIframe: true,
          params: providerAccountId
            ? {
                flow: 'edit',
                configName: 'Aggregation',
                providerAccountId,
              }
            : {
                flow: 'add',
                configName: 'Aggregation',
                providerId,
              },
          onSuccess,
          onError,
          onClose,
          onEvent,
        }
        try {
          console.log('[YodleeFastLink] Will open with options', options)
          window.fastlink?.open(options, YODLEE_CONTAINER_ID)
        } catch (err) {
          console.error('[YodleeFastLink] Failed to open FastLink', err)
          toast.error('Something went wrong (ERR_YODLEE_OPEN_FAIL)')
        }
      }, 0)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [rect, fastlinkRef] = useMeasure()
  const controls = useAnimation()

  useUpdateEffect(() => {
    controls.start({
      height: rect?.height,
      transition: {
        type: 'spring',
        stiffness: 550,
        damping: 40,
        restSpeed: 10,
      },
    })
  }, [controls, rect?.height])

  return (
    <div className="h-[30rem] w-[min(100vw,30rem)] overflow-y-auto p-4">
      <motion.div animate={controls}>
        <div
          ref={fastlinkRef as React.RefObject<HTMLDivElement>}
          id={YODLEE_CONTAINER_ID}
        />
      </motion.div>
    </div>
  )
}

const YODLEE_CONTAINER_ID = 'yodlee-container'

// MARK: -

declare global {
  interface Window {
    fastlink?: FastLink
  }
}

/** https://developer.yodlee.com/docs/fastlink/4.0/getting-started */
interface FastLink {
  open: (options: FastLinkOpenOptions, containerId: string) => unknown
  close: () => unknown
}

interface FastLinkOpenOptions {
  fastLinkURL: string
  accessToken: string
  forceIframe?: boolean
  forceRedirect?: boolean
  iframeScrolling?: 'auto' | boolean
  params: {
    configName:
      | 'Aggregation'
      | 'Verification'
      | 'AggregationPlusVerification'
      | 'VerificationPlusAggregation'
  } & (
    | {
        /**
         * https://developer.yodlee.com/docs/fastlink/4.0/advanced#LinkAccount
         */
        flow: 'add'
        providerId?: number | string
      }
    | {
        /**
         * https://developer.yodlee.com/docs/fastlink/4.0/advanced#EditCredentials
         */
        flow: 'edit'
        providerAccountId: number | string
      }
    | {}
  )
  onSuccess?: (data: OnSuccessData) => void
  onError?: (data: OnErrorData) => void
  onClose?: (data: OnCloseData) => void
  onEvent?: (data: unknown) => void
}

/**
 * {
 *   "fnToCall": "accountStatus",
 *   "providerName": "Dag Site",
 *   "requestId": "COX3l5DppA40dIiJDrkJjmmhVt8=",
 *   "providerAccountId": 32132249739,
 *   "status": "SUCCESS",
 *   "providerId": 16441,
 *   "additionalStatus": "ACCT_SUMMARY_RECEIVED"
 * }
 */
interface OnSuccessData {
  fnToCall: string
  providerId: number
  providerName: string
  requestId: string
  status: string
  additionalStatus: string
  providerAccountId: number
}

/**
 * {
 *   "providerId": 16441,
 *   "providerName": "Dag Site",
 *   "requestId": "rsglj0CIMoQsopKQrNLE4fz7nzE=",
 *   "reason": "Please visit Dag Site to update your account information or password.",
 *   "status": "FAILED",
 *   "additionalStatus": "USER_ACTION_NEEDED_AT_SITE",
 *   "providerAccountId": 11350520
 * }
 */
interface OnErrorData {
  providerId: number
  providerName: string
  requestId: string
  reason: string
  status: string
  additionalStatus: string
  providerAccountId: number
}

/**
 * {
 *   "action": "exit",
 *   "fnToCall": "accountStatus",
 *   "sites": [
 *     {
 *       "providerId": 5,
 *       "providerName": "Wells Fargo",
 *       "requestId": "vNHnOZ05sXZF1gFzEpF9BoMlSt0=",
 *       "status": "SUCCESS",
 *       "additionalStatus": "AVAILABLE_DATA_RETRIEVED",
 *       "providerAccountId": 11333937
 *     }
 *   ]
 * }
 */
interface OnCloseData {
  fnToCall: string
  action: string
  sites: Array<{
    providerId: number
    providerName: string
    requestId: string
    status: string
    additionalStatus: string
    providerAccountId: number
  }>
}
