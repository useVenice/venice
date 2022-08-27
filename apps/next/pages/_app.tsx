import {AppProvider} from '@ledger-sync/app'
import '@ledger-sync/uikit/register.web'
import {AppProps} from 'next/app'

function App({Component, pageProps}: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}

// export const WrappedAppNotWorkingYet = withLedgerSync({
//   config() {
//     return {
//       // Improve typing to omit options.config.url, it is a noop
//       url: 'http://localhost:3000/api',
//       transformer: superjson,
//       queryClientConfig: {defaultOptions: {queries: {staleTime: 60}}},
//     }
//   },
//   ssr: true,
// })(App)

export default App
