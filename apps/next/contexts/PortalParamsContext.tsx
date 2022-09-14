import {atom, Provider, useAtom, useAtomValue} from 'jotai'
import React from 'react'
import {BooleanParam, createEnumParam, StringParam} from 'use-query-params'

import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'

import {atomWithPersistedQueryParam} from './utils/atomWithPersistedQueryParam'

export const kAccessToken = 'accessToken' as const
export const kEnv = 'env' as const
const accessTokenAtom = atomWithPersistedQueryParam(
  kAccessToken,
  '',
  StringParam,
)
const envAtom = atomWithPersistedQueryParam<EnvName>(
  kEnv,
  'sandbox',
  createEnumParam(zEnvName.options),
)
const developerModeAtom = atomWithPersistedQueryParam(
  'developerMode',
  false,
  BooleanParam,
)
const isAdminAtom = atom(
  (get) =>
    get(accessTokenAtom) === 'admin' || process.env.NODE_ENV === 'development',
)

export function PortalParamsProvider({children}: {children: React.ReactNode}) {
  return <Provider>{children}</Provider>
}

export function useAccessToken() {
  return useAtomValue(accessTokenAtom)
}

export function useEnv() {
  return useAtomValue(envAtom)
}

export function useDeveloperMode() {
  return useAtom(developerModeAtom)
}

export function useIsAdmin() {
  return useAtomValue(isAdminAtom)
}
