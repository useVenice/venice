'use client'

import {useRouter} from 'next/router'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import {parseQueryParams, shallowOmitUndefined} from '@usevenice/util'

import {kAccessToken, kEnv} from '../lib/constants'
import {atomWithQueryParam} from './utils/atomWithQueryParam'

export const accessTokenAtom = atomWithQueryParam(kAccessToken, '', StringParam)

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
