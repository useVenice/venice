import type {UseQueryResult} from '@tanstack/react-query'
import {useQuery} from '@tanstack/react-query'
import {Papa} from '@usevenice/app-config/commonConfig'
import {getServerUrl} from '@usevenice/app-config/server-url'
import React, {useMemo, useState} from 'react'
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

export namespace QueryData {
  export type csv = string
  export type json = Record<string, unknown>
}

interface UseDatabaseQueryProps {
  apiKey: string
  query?: string
}

export function useDatabaseQuery(props: UseDatabaseQueryProps): DatabaseQuery {
  const {apiKey, query = ''} = props
  const serverUrl = getServerUrl(null)

  const [selectedOutputTab, setSelectedOutputTab] = useState(
    OutputTabsKey.dataTable,
  )

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
      return res.json()
    },
  })

  const csvQuery = React.useMemo(
    () =>
      ({
        ...jsonQuery,
        data: jsonQuery.data ? Papa.unparse(jsonQuery.data) : undefined,
      } as UseQueryResult<QueryData.csv>),
    [jsonQuery],
  )
  // No need to run a separate csv query here...

  function execute() {
    void jsonQuery.refetch()
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
