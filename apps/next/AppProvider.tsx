import {ledgerSyncConfig} from '@ledger-sync/app-config'
import {LSProvider} from '@ledger-sync/engine-frontend'
import {NextAdapter} from 'next-query-params'
import {QueryClient, QueryClientProvider} from 'react-query'
import {QueryParamProvider} from 'use-query-params'

const reactQueryClient = new QueryClient()

export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <QueryParamProvider adapter={NextAdapter}>
      <QueryClientProvider client={reactQueryClient}>
        <LSProvider queryClient={reactQueryClient} config={ledgerSyncConfig}>
          {children}
        </LSProvider>
      </QueryClientProvider>
    </QueryParamProvider>
  )
}
