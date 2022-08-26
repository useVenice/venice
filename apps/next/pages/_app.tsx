import {AppProvider} from '@ledger-sync/app'
import {ledgerSyncConfig, makeSyncHooks} from '@ledger-sync/app-config'
import '@ledger-sync/app-ui/register.web'
import {AppProps} from 'next/app'
import superjson from 'superjson'

export const syncHooks = makeSyncHooks(ledgerSyncConfig)

function App({Component, pageProps}: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
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
