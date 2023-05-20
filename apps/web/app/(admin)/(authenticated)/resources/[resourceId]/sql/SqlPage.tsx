'use client'

import {useQuery} from '@tanstack/react-query'
import React from 'react'

import type {Id} from '@usevenice/cdk-core'
import {CodeEditor} from '@usevenice/ui/CodeEditor'
import {DataGrid} from '@usevenice/ui/DataGrid'

import {NoSSR} from '@/components/NoSSR'

export function SqlPage(props: {resourceId: Id['reso']}) {
  const [queryText, setQueryText] = React.useState('SELECT * FROM transaction')

  const res = useQuery<Array<Record<string, unknown>>>({
    queryKey: ['sql', queryText],
    queryFn: () =>
      fetch(`/api/resources/${props.resourceId}/sql?q=${queryText}`).then((r) =>
        r.json(),
      ),
    // set low cache time because we don't want useQuery to return
    // the cached result causing the output to update without user
    // explicitly execute the query leading to a confusing behavior.
    cacheTime: 1000,
    // manual fetching only
    enabled: false,
    // this is needed so the output is not wiped when selecting a different query
    keepPreviousData: true,
  })

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        SQL for resource {props.resourceId}
      </h2>
      <div className="h-[400px]">
        <CodeEditor
          language="sql"
          value={queryText}
          onChange={(newText) => setQueryText(newText ?? '')}
          setKeybindings={(monaco) => [
            {
              key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              run: () => res.refetch(),
            },
          ]}
        />
      </div>
      <div className="h-[400px]">
        <NoSSR>
          <DataGrid isFetching={res.isFetching} rows={res.data ?? []} />
        </NoSSR>
      </div>
    </div>
  )
}
