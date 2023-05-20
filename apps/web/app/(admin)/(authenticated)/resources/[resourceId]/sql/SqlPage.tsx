'use client'

import {useQuery} from '@tanstack/react-query'
import {ChevronDown, Loader2} from 'lucide-react'
import React from 'react'

import {getServerUrl, kAcceptUrlParam} from '@usevenice/app-config/constants'
import type {Id} from '@usevenice/cdk-core'
import {Kbd} from '@usevenice/ui'
import {CodeEditor} from '@usevenice/ui/CodeEditor'
import {DataGrid} from '@usevenice/ui/DataGrid'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useToast,
} from '@usevenice/ui/new-components'

import {NoSSR} from '@/components/NoSSR'

export function SqlPage(props: {resourceId: Id['reso']}) {
  const [queryText, setQueryText] = React.useState(
    'SELECT * FROM transaction LIMIT 5',
  )

  const path = `/api/resources/${props.resourceId}/sql?q=${queryText}`

  function resultsUrl(opts: {format?: 'csv' | 'json'; download?: boolean}) {
    const url = new URL(path, getServerUrl(null))
    if (opts.format) {
      url.searchParams.set(kAcceptUrlParam, opts.format)
    }
    if (opts.download) {
      url.searchParams.set('dl', '1')
    }
    return url.toString()
  }

  const res = useQuery<Array<Record<string, unknown>>>({
    queryKey: ['sql', queryText],
    queryFn: () => fetch(path).then((r) => r.json()),
    // set low cache time because we don't want useQuery to return
    // the cached result causing the output to update without user
    // explicitly execute the query leading to a confusing behavior.
    cacheTime: 1000,
    // manual fetching only
    enabled: false,
    // this is needed so the output is not wiped when selecting a different query
    keepPreviousData: true,
  })
  const {withToast} = useWithToast()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        SQL for resource {props.resourceId}
      </h2>
      <div className="h-[400px] border">
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
                    navigator.clipboard.writeText(resultsUrl({format: 'csv'})),
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
                    navigator.clipboard.writeText(resultsUrl({format: 'json'})),
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
          {res.isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          RUN
          {!res.isFetching && <Kbd shortcut="⌘ ⏎" />}
        </Button>
        {/* Toolbar with dropdown "download" & copy result url,  run button */}
      </div>
      <div className="h-[400px]">
        <NoSSR>
          <DataGrid query={res} />
        </NoSSR>
      </div>
    </div>
  )
}

export function useWithToast() {
  const {toast} = useToast()
  const withToast = (
    fn: () => Promise<unknown>,
    opts: {title?: string; description?: string} = {},
  ) =>
    fn()
      .then((res) => {
        toast({
          variant: 'success',
          title: opts.title ?? 'Success',
          description: opts.description,
        })
        return res
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: `Error: ${err}`,
          description: opts.description,
        })
      })
  return {withToast}
}
