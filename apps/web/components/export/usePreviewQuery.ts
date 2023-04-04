import {useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import {useSupabase} from '../../contexts/session-context'

export interface PreviewQuery {
  data: {
    isEmpty: boolean
    rows: Array<Record<string, string | number | null>>
    totalCount: number
  }
  isFetching: boolean
  isInitial: boolean
}
/** @deprecated, Should use useQuery directly... */
export function usePreviewQuery({
  limit,
  table,
}: {
  limit: number
  table: string
}): PreviewQuery {
  interface QueryResult {
    rows: Array<Record<string, string | number | null>>
    totalCount: number
  }
  const supabase = useSupabase()

  const query = useQuery<QueryResult>({
    queryKey: ['export.preview', table],
    queryFn: async () => {
      if (!table) {
        return {
          rows: [],
          totalCount: 0,
        }
      }

      const {count, data, error} = await supabase
        .from(table)
        // Use estimated count to workaround issue with bad RLS performance for auth.is_admin()
        // https://usevenice.slack.com/archives/C04NUANB7FW/p1680462683033239
        .select('*', {count: 'exact'})
        .limit(limit)

      if (error) {
        throw new Error(error.message)
      }
      return {
        rows: data as Array<Record<string, string | number | null>>,
        totalCount: count ?? 0,
      }
    },
    keepPreviousData: true,
  })

  const data = useMemo(() => {
    const {rows = [], totalCount = 0} = query.data ?? {}

    // not very explicit & readable but to appease the type
    if (!rows[0]) {
      return {
        isEmpty: true,

        rows: [],
        totalCount: 0,
      }
    }

    return {
      isEmpty: rows.length === 0,
      rows,
      totalCount,
    }
  }, [query.data])

  return {
    isInitial: query.isLoading,
    isFetching: query.isFetching,
    data,
  }
}
