import '@ledger-sync/app-ui/register.web'

import {ReactSupabaseProvider, supabase} from '@ledger-sync/app'
import {ledgerSyncConfig, makeSyncHooks} from '@ledger-sync/app-config'
import {Auth, darkTheme, ThemeProvider} from '@ledger-sync/app-ui'
import {AppProps} from 'next/app'
import {QueryClient, QueryClientProvider} from 'react-query'
import superjson from 'superjson'

const reactQueryClient = new QueryClient()

export const syncHooks = makeSyncHooks(ledgerSyncConfig)

function App({Component, pageProps}: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <ReactSupabaseProvider value={supabase}>
        <QueryClientProvider client={reactQueryClient}>
          <syncHooks.Provider queryClient={reactQueryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              value={{
                light: 'light',
                dark: darkTheme.className,
              }}>
              <Component {...pageProps} />
            </ThemeProvider>
          </syncHooks.Provider>
        </QueryClientProvider>
      </ReactSupabaseProvider>
    </Auth.UserContextProvider>
  )
}

export const WrappedAppNotWorkingYet = syncHooks.withLedgerSync({
  config() {
    return {
      // Improve typing to omit options.config.url, it is a noop
      url: 'http://localhost:3000/api',
      transformer: superjson,
      queryClientConfig: {defaultOptions: {queries: {staleTime: 60}}},
    }
  },
  ssr: true,
})(App)

export default App
