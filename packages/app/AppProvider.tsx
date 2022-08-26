import {
  Constants,
  ledgerSyncConfig,
  makeSyncHooks,
} from '@ledger-sync/app-config'
import {Auth, darkTheme, ThemeProvider} from '@ledger-sync/app-ui'
import {createClient} from '@supabase/supabase-js'
import {QueryClient, QueryClientProvider} from 'react-query'
import {Provider as ReactSupabaseProvider} from 'react-supabase'

const reactQueryClient = new QueryClient()

export const supabase = createClient(
  Constants.supabaseUrl,
  Constants.supabaseAnonKey,
)
;(globalThis as any).supabase = supabase

export const syncHooks = makeSyncHooks(ledgerSyncConfig)

export function AppProvider({children}: {children: React.ReactNode}) {
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
              {children}
            </ThemeProvider>
          </syncHooks.Provider>
        </QueryClientProvider>
      </ReactSupabaseProvider>
    </Auth.UserContextProvider>
  )
}
