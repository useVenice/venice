import {useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import {browserSupabase} from '../../contexts/common-contexts'

export interface PreviewQuery {
  data: {
    headings: string[]
    rows: Array<Record<string, string | number | null>>
    totalCount: number
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
  interface QueryResult {
    rows: Array<Record<string, string | number | null>>
    totalCount: number | null
  }

  const query = useQuery<QueryResult>({
    queryKey: ['export.preview', table],
    queryFn: async () => {
      if (!table) {
        return {
          rows: [],
          totalCount: 0,
        }
      }

      const {count, data, error} = await browserSupabase
        .from(table)
        .select('*', {count: 'exact'})
        .limit(limit)

      if (error) {
        throw new Error(error.message)
      }
      return {
        rows: data as Array<Record<string, string | number | null>>,
        totalCount: count,
      }
    },
    // don't fetch until a table is selected
    enabled: table != null,
    keepPreviousData: true,
  })

  const data = useMemo(() => {
    const {rows = [], totalCount} = query.data ?? {}

    // not very explicit & readable but to appease the type
    if (!rows[0]) {
      return {
        headings: [],
        rows: [],
        totalCount: 0,
      }
    }

    return {
      // TODO get column names from backend, getting from the first object
      // might not always be correct
      headings: Object.keys(rows[0]),
      rows,
      // is it correct to default totalCount to 0 instead of surface null
      totalCount: totalCount ?? 0,
    }
  }, [query.data])

  return {
    // since we disable query until a table is selected,
    // isLoading=true means it's the initial state
    isInitial: query.isLoading,
    isFetching: query.isFetching,
    data,
  }
}
