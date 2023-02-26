import {Button, CircularProgress} from '@usevenice/ui'
import {DownloadIcon, PlayIcon} from '@usevenice/ui/icons'
import {useEffect} from 'react'
import {OutputFormatTabs} from './OutputFormatTabs'
import {OutputTabsKey} from './OutputTabsKey'
import type {DatabaseQuery} from './useDatabaseQuery'

interface ActionsBarProps {
  databaseQuery: DatabaseQuery
}

export function ActionsBar(props: ActionsBarProps) {
  const {databaseQuery} = props
  const isFetching =
    databaseQuery.csv.isFetching || databaseQuery.json.isFetching

  return (
    <section className="flex justify-between gap-4">
      <ExecuteQueryActionGroup
        executeQuery={databaseQuery.execute}
        isFetching={isFetching}
      />
      {/* OutputControlsActionGroup */}
      <div className="flex items-center gap-3">
        <OutputFormatTabs
          options={[
            {key: OutputTabsKey.dataTable, label: 'Data Table'},
            {key: OutputTabsKey.json, label: 'JSON'},
            {key: OutputTabsKey.csv, label: 'CSV'},
          ]}
        />
        <Button
          variant="primary"
          className="gap-1"
          onClick={() => window.open(databaseQuery.getDownloadUrl())}>
          <DownloadIcon className="h-4 w-4 fill-current text-offwhite" />
          Download
        </Button>
      </div>
    </section>
  )
}

interface ExecuteQueryActionGroupProps {
  executeQuery: () => void
  isFetching: boolean
}

function ExecuteQueryActionGroup(props: ExecuteQueryActionGroupProps) {
  const {executeQuery, isFetching} = props

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
      <Button
        variant="primary"
        className="gap-1"
        onClick={executeQuery}
        disabled={isFetching}>
        {isFetching ? (
          <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
        ) : (
          <PlayIcon className="h-4 w-4 fill-current text-offwhite" />
        )}
        Execute
      </Button>
      <span className="hidden font-mono text-sm text-venice-gray-muted lg:inline-flex">
        or hit ⌘ + Enter
      </span>
    </div>
  )
}
