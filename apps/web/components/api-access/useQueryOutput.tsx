import {useQuery} from '@tanstack/react-query'
import type {UseQueryResult} from '@tanstack/react-query'

interface UseQueryOutputProps {
  apiKey: string
  format: 'csv' | 'json'
  query?: string
  serverUrl: string
}

export function useQueryOutput<TData>(
  props: UseQueryOutputProps,
): UseQueryResult<TData> {
  const {apiKey, format, query, serverUrl} = props
  return useQuery({
    queryKey: ['/api/sql', format, query],
    queryFn: async ({signal}) => {
      const url = new URL('/api/sql', serverUrl)
      const params = new URLSearchParams({
        apiKey,
        format,
        q: query ?? '',
      })

      const res = await fetch(`${url}?${params}`, {signal})
      if (!res.ok) {
        const message = await res.text()
        throw new Error(`Network error: ${message}`)
      }

      if (format === 'json') {
        return res.json()
      }
      return res.text()
    },
    // set low cache time because we don't want useQuery to return
    // the cached result causing the output to update without user
    // explicitly execute the query leading to a confusing behavior.
    cacheTime: 1000,
    // manual fetching only
    enabled: false,
    // this is needed so the output is not wiped when selecting a different
    // saved query.
    keepPreviousData: true,
  })
}
