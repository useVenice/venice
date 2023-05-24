'use client'

import {useQuery} from '@tanstack/react-query'
import {ChevronDown, Loader2} from 'lucide-react'
import React from 'react'

import {getServerUrl, kAcceptUrlParam} from '@usevenice/app-config/constants'
import type {Id} from '@usevenice/cdk-core'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Kbd,
  Resizable,
  useWithToast,
} from '@usevenice/ui'
import {CodeEditor} from '@usevenice/ui/components/CodeEditor'
import {DataGrid} from '@usevenice/ui/components/DataGrid'

import {NoSSR} from '@/components/NoSSR'

const qListTable = `
  SELECT table_name, table_type FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name
`

function sqlUrl(opts: {
  resourceId: Id['reso']
  query: string
  format?: 'csv' | 'json'
  download?: boolean
}) {
  const url = new URL(
    `/api/resources/${opts.resourceId}/sql`,
    getServerUrl(null),
  )
  url.searchParams.set('q', opts.query)
  if (opts.format) {
    url.searchParams.set(kAcceptUrlParam, opts.format)
  }
  if (opts.download) {
    url.searchParams.set('dl', '1')
  }
  return url
}

export function SqlPage({resourceId}: {resourceId: Id['reso']}) {
  const [queryText, setQueryText] = React.useState('')

  const res = useQuery<Array<Record<string, unknown>>>({
    queryKey: ['sql', resourceId, queryText],
    queryFn: () =>
      fetch(sqlUrl({resourceId, query: queryText})).then((r) => r.json()),
    // set low cache time because we don't want useQuery to return
    // the cached result causing the output to update without user
    // explicitly execute the query leading to a confusing behavior.
    cacheTime: 1000,
    // manual fetching only
    enabled: false,
    // this is needed so the output is not wiped when selecting a different query
    keepPreviousData: true,
  })
  const listTablesRes = useQuery({
    queryKey: ['sql', resourceId, qListTable],
    queryFn: () =>
      fetch(sqlUrl({resourceId, query: qListTable})).then(
        (r) =>
          r.json() as Promise<
            Array<{table_name: string; table_type: 'BASE TABLE' | 'VIEW'}>
          >,
      ),
    select: (rows) => ({
      Views: rows.filter((r) => r.table_type === 'VIEW'),
      Tables: rows.filter((r) => r.table_type === 'BASE TABLE'),
    }),
  })

  const {withToast} = useWithToast()

  function resultsUrl(opts: {format?: 'csv' | 'json'; download?: boolean}) {
    return sqlUrl({...opts, resourceId, query: queryText}).toString()
  }

  return (
    <div className="flex h-[100%] flex-col">
      <h2 className="mx-6 mb-4 mt-6 text-2xl font-semibold tracking-tight">
        SQL Explorer
      </h2>
      <div className="grow">
        <Resizable
          defaultSize={{height: '50%', width: '100%'}}
          className="flex border-b-2 px-6">
          <div className="w-32">
            {listTablesRes.isLoading && <Loader2 className="animate-spin" />}
            {Object.entries(listTablesRes.data ?? {}).map(([title, tables]) =>
              !tables.length ? null : (
                <div key={title}>
                  <div className="mb-2 font-medium">{title}</div>
                  {tables.map((t) => (
                    <a
                      className="block cursor-pointer px-1 pl-2 hover:underline"
                      key={t.table_name}
                      onClick={() =>
                        setQueryText(`SELECT * FROM ${t.table_name} LIMIT 5`)
                      }>
                      {t.table_name}
                    </a>
                  ))}
                </div>
              ),
            )}
          </div>
          <div className="grow">
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
        </Resizable>
        <div className="h-[100%] min-h-[100px] px-6">
          <div className="flex items-center p-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex px-1 text-secondary-foreground">
                Results
                <ChevronDown className="ml-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a
                    href={resultsUrl({download: true, format: 'csv'})}
                    target="_blank"
                    rel="noreferrer">
                    Download CSV
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    withToast(
                      () =>
                        navigator.clipboard.writeText(
                          resultsUrl({format: 'csv'}),
                        ),
                      {title: 'Copied to clipboard'},
                    )
                  }>
                  Copy CSV URL
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={resultsUrl({download: true, format: 'json'})}
                    target="_blank"
                    rel="noreferrer">
                    Download JSON
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    withToast(
                      () =>
                        navigator.clipboard.writeText(
                          resultsUrl({format: 'json'}),
                        ),
                      {title: 'Copied to clipboard'},
                    )
                  }>
                  Copy JSON URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => res.refetch()}
              disabled={res.isFetching}>
              {res.isFetching && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              RUN
              {!res.isFetching && <Kbd shortcut="⌘ ⏎" />}
            </Button>
            {/* Toolbar with dropdown "download" & copy result url,  run button */}
          </div>
          <NoSSR>
            <DataGrid className="grow" query={res} />
          </NoSSR>
        </div>
      </div>
    </div>
  )
}
