import type {QueryClient} from '@tanstack/react-query'
import type {FlatRouter} from '@usevenice/engine-backend'

import {createTRPCReact, httpBatchLink, httpLink} from '@trpc/react-query'
import React from 'react'

export const trpcReact = createTRPCReact<FlatRouter>()

// TODO: Make use of this from VeniceProvider?
export function TRPCProvider({
  apiUrl,
  queryClient,
  children,
  accessToken,
}: {
  apiUrl?: string
  queryClient: QueryClient
  accessToken?: string | null
  children: React.ReactNode
}) {
  const __DEBUG__ =
    typeof window !== 'undefined' && window.location.href.includes('localhost')

  // TODO: Should we keep trpcClient the and useRef for the accessToken instead?
  const trpcClient = React.useMemo(
    () =>
      // Disable reqeuest batching in DEBUG mode for easier debugging
      // createTRPCProxyClient<FlatRouter>({
      trpcReact.createClient({
        links: [
          (__DEBUG__ ? httpLink : httpBatchLink)({
            url: apiUrl ?? '/api/trpc',
            headers: () => ({
              ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
            }),
          }),
        ],
      }),
    [__DEBUG__, accessToken, apiUrl],
  )
  ;(globalThis as any).trpcClient = trpcClient

  return (
    // TODO: Figure out the purpose of ssrState and ssrContext in trpc.Provider
    <trpcReact.Provider queryClient={queryClient} client={trpcClient}>
      {children}
    </trpcReact.Provider>
  )
}
