import {useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import {browserSupabase} from '../../contexts/common-contexts'

export interface PreviewQuery {
  data: {
    headings: string[]
    rows: Array<Record<string, string | number | null>>
  }
  isFetching: boolean
  isInitial: boolean
}

export function usePreviewQuery({
  table,
  limit,
}: {
  table?: string
  limit: number
}): PreviewQuery {
  const query = useQuery({
    queryKey: ['export.preview', table],
    queryFn: async () => {
      if (!table) {
        return []
      }

      const {data, error: postgresError} = await browserSupabase
        .from(table)
        .select()
        .limit(limit)

      if (postgresError) {
        throw new Error(postgresError.message)
      }
      return data as Array<Record<string, string | number | null>>
    },
    // don't fetch until a table is selected
    enabled: table != null,
    keepPreviousData: true,
  })

  const data = useMemo(() => {
    const rows = query.data
    if (rows?.[0]) {
      return {
        // TODO get column names from backend, getting from the first object
        // might not always be correct
        headings: Object.keys(rows[0]),
        rows,
      }
    }
    return {headings: [], rows: []}
  }, [query.data])

  return {
    // since we disable query until a table is selected,
    // isLoading=true means it's the initial state
    isInitial: query.isLoading,
    isFetching: query.isFetching,
    data,
  }
}
