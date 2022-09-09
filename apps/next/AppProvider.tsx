import {NextAdapter} from 'next-query-params'
import {QueryClient, QueryClientProvider} from 'react-query'
import {QueryParamProvider} from 'use-query-params'

import {ledgerSyncConfig} from '@ledger-sync/app-config/ledgerSync.config'
import {LSProvider} from '@ledger-sync/engine-frontend'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 5 * 60 * 1000, // 5 mins
      refetchOnWindowFocus: false, // Too many requests for going between devTool and not... alternative is to change the stale time
    },
  },
})

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
