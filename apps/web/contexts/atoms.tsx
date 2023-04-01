'use client'

import {useRouter} from 'next/router'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import type {EnvName} from '@usevenice/cdk-core'
import {zEnvName} from '@usevenice/cdk-core'
import {parseQueryParams, shallowOmitUndefined} from '@usevenice/util'

import {atomWithQueryParam} from './utils/atomWithQueryParam'
import {commonEnv} from '@usevenice/app-config/commonConfig'

export const kAccessToken = 'accessToken' as const
export const kEnv = 'env' as const

export const kLedgerId = 'ledgerId'

export const ledgerIdAtom = atomWithQueryParam(kLedgerId, '', StringParam)
export const accessTokenAtom = atomWithQueryParam(kAccessToken, '', StringParam)
export const envAtom = atomWithQueryParam<EnvName>(
  kEnv,
  commonEnv.DEFAULT_CONNECT_ENV,
  createEnumParam(zEnvName.options),
)

export const developerModeAtom = atomWithQueryParam(
  'developerMode',
  false,
  BooleanParam,
)

export const modeAtom = atomWithQueryParam(
  'mode',
  'manage',
  createEnumParam(['connect' as const, 'manage' as const]),
)

export const pipelineTypeAtom = atomWithQueryParam(
  'type',
  'sources',
  createEnumParam(['sources' as const, 'destinations' as const]),
)

export const searchByAtom = atomWithQueryParam(
  'searchBy',
  'institution',
  createEnumParam(['institution' as const, 'provider' as const]),
)

export function useRouterPlus() {
  const router = useRouter()
  return {
    ...router,
    pushPathname: (pathname: string) => {
      const query = parseQueryParams(
        typeof window !== 'undefined' ? window.location.search : '',
      )
      return router.push({
        pathname,
        // Preserve whitelisted params
        query: shallowOmitUndefined({
          [kAccessToken]: query[kAccessToken] as string | undefined,
          [kEnv]: query[kEnv] as string | undefined,
        }),
      })
    },
  }
}
