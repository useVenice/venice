import {useAtomValue} from 'jotai'
import {useRouter} from 'next/router'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'
import {stringifyQueryParams} from '@ledger-sync/util'

import {atomWithQueryParam} from './utils/atomWithQueryParam'

export const kAccessToken = 'accessToken' as const
export const kEnv = 'env' as const
export const accessTokenAtom = atomWithQueryParam(kAccessToken, '', StringParam)
export const envAtom = atomWithQueryParam<EnvName>(
  kEnv,
  'sandbox',
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

export const searchByAtom = atomWithQueryParam(
  'searchBy',
  'institution',
  createEnumParam(['institution' as const, 'provider' as const]),
)

export function useEnv() {
  return useAtomValue(envAtom)
}

export function useRouterPlus() {
  const router = useRouter()

  return {
    ...router,
    pushPathname: (pathname: string) =>
      // should we use window.location.search.slice(1) instead?
      // so that we omit path-based query from the searchQuery?
      router.push({pathname, query: stringifyQueryParams(router.query)}),
  }
}
