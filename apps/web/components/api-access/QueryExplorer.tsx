import {Button, TabsPrimitive as Tabs} from '@usevenice/ui'
import {DownloadIcon, PlayIcon} from '@usevenice/ui/icons'
import {useEffect, useState} from 'react'
import {Editor} from '../Editor'
import {OutputFormatTabs} from './OutputFormatTabs'
import {
  CsvQueryOutput,
  DataTableQueryOutput,
  JsonQueryOutput,
} from './QueryOutput'
import {useQueryOutput} from './useQueryOutput'
import {SavedQueryId, useSavedQuery} from './useSavedQuery'

interface QueryExplorerProps {
  apiKey: string
  serverUrl: string
}

export function QueryExplorer(props: QueryExplorerProps) {
  const {apiKey, serverUrl} = props

  const savedQuery = useSavedQuery()
  const [query, setQuery] = useState(
    () => savedQuery.getById(SavedQueryId.transaction)?.query,
  )

  // have to loosen the type to string because Tabs.Root doesn't infer the type
  const [outputFormat, setOutputFormat] = useState<string>(
    OutputFormatTabsKey.json,
  )

  const outputProps = {apiKey, query, serverUrl}
  // need separate instances of the query because the cached value
  // is a formatted data from the API thus cannot be used interchangeably.
  //
  // this allows switching between output format to display the correct data
  // as well as allowing to show previously cached output when switching back.
  const csvQueryOutput = useQueryOutput<string>({...outputProps, format: 'csv'})
  const jsonQueryOutput = useQueryOutput<Array<{}>>({
    ...outputProps,
    format: 'json',
  })

  function handleNavItemClick(id: SavedQueryId): void {
    setQuery(savedQuery.getById(id)?.query)
  }

  function executeQuery() {
    if (outputFormat === 'csv') {
      void csvQueryOutput.refetch()
    } else {
      void jsonQueryOutput.refetch()
    }
  }

  function handleDownloadClick() {
    const format =
      outputFormat === OutputFormatTabsKey.dataTable ? 'csv' : outputFormat
    const url = new URL('/api/sql', serverUrl)
    const params = new URLSearchParams({
      apiKey,
      dl: '1',
      format,
      q: query ?? '',
    })
    window.open(`${url}?${params}`)
  }

  return (
    <div className="grid gap-6">
      <div className="grid h-[15rem] grid-cols-[minmax(min-content,12rem)_1fr] overflow-hidden rounded-lg border border-venice-black-300 bg-venice-black-500">
        {/* SavedQueryNav | SavedQuerySelect */}
        <nav className="grid gap-2 overflow-y-auto border-r border-venice-black-300 bg-venice-black py-3">
          <NavGroup
            title="Views"
            items={[SavedQueryId.posting, SavedQueryId.transaction]}
            onItemClick={handleNavItemClick}
          />
          <NavGroup
            title="Raw data"
            items={[
              SavedQueryId.raw_account,
              SavedQueryId.raw_commodity,
              SavedQueryId.raw_transaction,
            ]}
            onItemClick={handleNavItemClick}
          />
          <NavGroup
            title="Meta data"
            items={[
              SavedQueryId.institution,
              SavedQueryId.pipeline,
              SavedQueryId.resource,
            ]}
            onItemClick={handleNavItemClick}
          />
        </nav>
        <div className="p-3">
          <Editor
            language="sql"
            value={query}
            onChange={setQuery}
            setKeybindings={(monaco) => [
              {
                key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                run: executeQuery,
              },
            ]}
          />
        </div>
      </div>
      <Tabs.Root
        id="OutputFormatTabs"
        className="grid gap-6"
        value={outputFormat}
        onValueChange={setOutputFormat}>
        <section className="flex justify-between gap-4">
          <ExecuteQueryActionGroup executeQuery={executeQuery} />
          {/* OutputControlsActionGroup */}
          <div className="flex items-center gap-3">
            <OutputFormatTabs
              options={[
                {key: OutputFormatTabsKey.dataTable, label: 'Data Table'},
                {key: OutputFormatTabsKey.json, label: 'JSON'},
                {key: OutputFormatTabsKey.csv, label: 'CSV'},
              ]}
            />
            <Button
              variant="primary"
              className="gap-1"
              onClick={handleDownloadClick}>
              <DownloadIcon className="h-4 w-4 fill-current text-offwhite" />
              Download
            </Button>
          </div>
        </section>
        <Tabs.Content value={OutputFormatTabsKey.dataTable}>
          <DataTableQueryOutput
            isFetching={jsonQueryOutput.isFetching}
            output={jsonQueryOutput.data}
            query={query}
            serverUrl={serverUrl}
          />
        </Tabs.Content>
        <Tabs.Content value={OutputFormatTabsKey.json}>
          <JsonQueryOutput
            isFetching={jsonQueryOutput.isFetching}
            output={jsonQueryOutput.data}
            query={query}
            serverUrl={serverUrl}
          />
        </Tabs.Content>
        <Tabs.Content value={OutputFormatTabsKey.csv}>
          <CsvQueryOutput
            isFetching={csvQueryOutput.isFetching}
            output={csvQueryOutput.data}
            query={query}
            serverUrl={serverUrl}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

interface NavGroupProps {
  title: string
  items: SavedQueryId[]
  onItemClick: (itemId: SavedQueryId) => void
}

function NavGroup(props: NavGroupProps) {
  const {title, items, onItemClick} = props
  return (
    <div className="px-3 font-mono">
      <h5 className="text-sm text-venice-gray-muted">
        {title} ({items.length})
      </h5>
      <ul className="mt-1 grid gap-1 px-3 text-xs text-offwhite">
        {items.map((v) => (
          <li key={v}>
            <button onClick={() => onItemClick(v)}>{v}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface ExecuteQueryButtonProps {
  executeQuery: () => void
}

function ExecuteQueryActionGroup(props: ExecuteQueryButtonProps) {
  const {executeQuery} = props

  // binds keyboard shortcuts
  useEffect(() => {
    function handleKeyboardShortcut(event: KeyboardEvent) {
      // TODO handle Windows platform
      if (event.metaKey && event.key === 'Enter') {
        executeQuery()
      }
    }
    document.addEventListener('keydown', handleKeyboardShortcut)
    return () => document.removeEventListener('keydown', handleKeyboardShortcut)
  }, [executeQuery])

  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" className="gap-1" onClick={executeQuery}>
        <PlayIcon className="h-4 w-4 fill-current text-offwhite" />
        Execute
      </Button>
      <span className="font-mono text-sm text-venice-gray-muted">
        or hit ⌘ + Enter
      </span>
    </div>
  )
}

enum OutputFormatTabsKey {
  csv = 'csv',
  dataTable = 'dataTable',
  json = 'json',
}
