import {useAtomValue} from 'jotai'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'

import {atomWithQueryParam} from './utils/atomWithQueryParam'

export const kAccessToken = 'accessToken' as const
export const kEnv = 'env' as const
export const accessTokenAtom = atomWithQueryParam(kAccessToken, '', StringParam)
const envAtom = atomWithQueryParam<EnvName>(
  kEnv,
  'sandbox',
  createEnumParam(zEnvName.options),
)

export const developerModeAtom = atomWithQueryParam(
  'developerMode',
  false,
  BooleanParam,
)

export function useEnv() {
  return useAtomValue(envAtom)
}
