import {ledgerSyncConfig} from '@ledger-sync/app-config'
import {LSProvider} from '@ledger-sync/engine-frontend'
import {darkTheme, ThemeProvider} from '@ledger-sync/uikit'
import {QueryClient, QueryClientProvider} from 'react-query'

const reactQueryClient = new QueryClient()

export function AppProvider({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <LSProvider queryClient={reactQueryClient} config={ledgerSyncConfig}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          value={{
            light: 'light',
            dark: darkTheme.className,
          }}>
          {children}
        </ThemeProvider>
      </LSProvider>
    </QueryClientProvider>
  )
}
