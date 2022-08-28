import {AppProvider} from '@ledger-sync/app'
import withTwindApp from '@twind/next/app'
import {AppProps} from 'next/app'
import Head from 'next/head'
import twindConfig from '../twind.config'

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </>
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

export default withTwindApp(twindConfig, App)
