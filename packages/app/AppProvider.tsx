import {ledgerSyncConfig, makeSyncHooks} from '@ledger-sync/app-config'
import {darkTheme, ThemeProvider} from '@ledger-sync/app-ui'
import {QueryClient, QueryClientProvider} from 'react-query'

const reactQueryClient = new QueryClient()

export const syncHooks = makeSyncHooks(ledgerSyncConfig)

export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <syncHooks.Provider queryClient={reactQueryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          value={{
            light: 'light',
            dark: darkTheme.className,
          }}>
          {children}
        </ThemeProvider>
      </syncHooks.Provider>
    </QueryClientProvider>
  )
}
