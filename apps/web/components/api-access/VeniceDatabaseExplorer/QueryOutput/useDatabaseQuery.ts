import type {UseQueryResult} from '@tanstack/react-query'
import {useQuery} from '@tanstack/react-query'
import {z} from '@usevenice/util'
import {useMemo, useState} from 'react'
import {OutputFormat} from './OutputFormat'
import {isOutputTabsKey, OutputTabsKey} from './OutputTabsKey'

export interface DatabaseQuery {
  selectedOutputTab: OutputTabsKey
  // selection is string to work with the type of `Tabs.Root.onValueChange`
  onOutputTabsValueChange: (selection: string) => void

  getDownloadUrl: () => string
  getFetchUrl: () => string

  readonly csv: UseQueryResult<QueryData.csv>
  readonly json: UseQueryResult<QueryData.json>

  execute: () => void
}

const JsonQuerySchema = z.array(
  z.record(z.union([z.string(), z.number(), z.null()])),
)

export namespace QueryData {
  export type csv = string
  export type json = z.infer<typeof JsonQuerySchema>
}

interface UseDatabaseQueryProps {
  apiKey: string
  query?: string
  serverUrl: string
}

export function useDatabaseQuery(props: UseDatabaseQueryProps): DatabaseQuery {
  const {apiKey, query = '', serverUrl} = props

  const [selectedOutputTab, setSelectedOutputTab] = useState(OutputTabsKey.json)

  function onOutputTabsValueChange(value: string): void {
    if (isOutputTabsKey(value)) {
      setSelectedOutputTab(value)
    }
  }

  const format = useMemo(() => {
    switch (selectedOutputTab) {
      case OutputTabsKey.csv:
        return {
          download: OutputFormat.csv,
          fetch: OutputFormat.csv,
        }
      case OutputTabsKey.dataTable:
        return {
          download: OutputFormat.csv,
          fetch: OutputFormat.json,
        }
      case OutputTabsKey.json:
        return {
          download: OutputFormat.json,
          fetch: OutputFormat.json,
        }
    }
  }, [selectedOutputTab])

  function getDownloadUrl(): string {
    const url = new URL('/api/sql', serverUrl)
    const params = new URLSearchParams({
      apiKey,
      dl: '1',
      format: format.download,
      q: query,
    })
    return `${url}?${params}`
  }

  function getFetchUrl(): string {
    const url = new URL('/api/sql', serverUrl)
    const params = new URLSearchParams({
      apiKey,
      format: format.fetch,
      q: query,
    })
    return `${url}?${params}`
  }

  const queryOptions = {
    // set low cache time because we don't want useQuery to return
    // the cached result causing the output to update without user
    // explicitly execute the query leading to a confusing behavior.
    cacheTime: 1000,
    // manual fetching only
    enabled: false,
    // this is needed so the output is not wiped when selecting a different
    // saved query.
    keepPreviousData: true,
  }

  // need separate instances of useQuery by output format because
  // the cached value is a formatted data from the API thus
  // cannot be used interchangeably.
  //
  // this allows switching between output format to display the correct data
  // as well as allowing to show previously cached output when switching back.

  const csvQuery = useQuery({
    ...queryOptions,
    queryKey: ['/api/sql', OutputFormat.csv, query],
    queryFn: async ({signal}) => {
      const url = getFetchUrl()
      const res = await fetch(url, {signal})
      if (!res.ok) {
        const message = await res.text()
        throw new Error(`Network error: ${message}`)
      }
      return res.text()
    },
  })

  const jsonQuery = useQuery({
    ...queryOptions,
    queryKey: ['/api/sql', OutputFormat.json, query],
    queryFn: async ({signal}) => {
      const url = getFetchUrl()
      const res = await fetch(url, {signal})
      if (!res.ok) {
        const message = await res.text()
        throw new Error(`Network error: ${message}`)
      }

      const j: unknown = await res.json()
      return JsonQuerySchema.parse(j)
    },
  })

  function execute(): void {
    if (format.fetch === OutputFormat.csv) {
      void csvQuery.refetch()
    } else {
      void jsonQuery.refetch()
    }
  }

  return {
    selectedOutputTab,
    onOutputTabsValueChange,
    getDownloadUrl,
    getFetchUrl,
    csv: csvQuery,
    json: jsonQuery,
    execute,
  }
}
