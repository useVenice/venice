import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister'
import {QueryClient} from '@tanstack/react-query'
import {persistQueryClient} from '@tanstack/react-query-persist-client'

// TODO: Should this work across both and remain in the global scope?
export const browserQueryClient = createQueryClient()

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 5 * 60 * 1000, // 5 mins by default, reduce refetching...
        refetchOnWindowFocus: false, // Too many requests for going between devTool and not... alternative is to change the stale time
        // refetchOnMount: false,
        // refetchOnReconnect: false,
        // How do we configure it that the only time we "refetch" is when we cmd+r reload the window?
        // We still want to stale-while-revalidate though and thus we persist the query cache.
      },
    },
  })
}

if (
  typeof window !== 'undefined' &&
  !window.location.href.includes('localhost')
) {
  const persister = createSyncStoragePersister({storage: window.localStorage})
  // persistor.removeClient() // Will clean up cache

  void persistQueryClient({
    queryClient: browserQueryClient,
    persister,
    // Change this key if we change the format of the data to avoid crashes
    // also we should clear any persisted data if userId ever changes
    buster: undefined, // Should check against userId and version
  })
  console.log('Persist query client...')
}
