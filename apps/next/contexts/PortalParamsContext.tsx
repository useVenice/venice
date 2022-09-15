import {useAtomValue} from 'jotai'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'

import {atomWithPersistedQueryParam} from './utils/atomWithPersistedQueryParam'

export const kAccessToken = 'accessToken' as const
export const kEnv = 'env' as const
export const accessTokenAtom = atomWithPersistedQueryParam(
  kAccessToken,
  '',
  StringParam,
)
const envAtom = atomWithPersistedQueryParam<EnvName>(
  kEnv,
  'sandbox',
  createEnumParam(zEnvName.options),
)

export const developerModeAtom = atomWithPersistedQueryParam(
  'developerMode',
  false,
  BooleanParam,
)

export function useEnv() {
  return useAtomValue(envAtom)
}
