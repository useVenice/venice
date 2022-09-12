import React from 'react'
import {createEnumParam, StringParam, useQueryParam} from 'use-query-params'
import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'

interface PortalParamsContextValue {
  accessToken: string | null
  env: EnvName
}

const PortalParamsContext = React.createContext<PortalParamsContextValue>({
  accessToken: '',
  env: 'sandbox',
})

export function PortalParamsProvider({children}: {children: React.ReactNode}) {
  const [accessToken] = useQueryParam('accessToken', StringParam)
  const [env] = useQueryParam('env', createEnumParam(zEnvName.options))
  const value = React.useMemo(
    (): PortalParamsContextValue => ({
      accessToken: accessToken ?? null,
      env: env ?? 'sandbox',
    }),
    [accessToken, env],
  )
  return (
    <PortalParamsContext.Provider value={value}>
      {children}
    </PortalParamsContext.Provider>
  )
}

export function usePortalParams() {
  return React.useContext(PortalParamsContext)
}
