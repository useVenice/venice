import {CircularProgress, TabsPrimitive as Tabs} from '@usevenice/ui'
import {useMemo} from 'react'
import {DataTable, EmptyDataTable} from '../../../DataTable'
import {ActionsBar} from './ActionsBar'
import {ApiEndpointCard} from './ApiEndpointCard'
import {OutputFormat} from './OutputFormat'
import {OutputTabsKey} from './OutputTabsKey'
import type {DatabaseQuery, QueryData} from './useDatabaseQuery'

interface QueryOutputProps {
  databaseQuery: DatabaseQuery
}

export function QueryOutput(props: QueryOutputProps) {
  const {databaseQuery} = props
  return (
    <Tabs.Root
      id="OutputFormatTabs"
      className="grid gap-6"
      value={databaseQuery.selectedOutputTab}
      onValueChange={databaseQuery.onOutputTabsValueChange}>
      <ActionsBar databaseQuery={databaseQuery} />
      <div className="overflow-x-auto">
        <Tabs.Content value={OutputTabsKey.dataTable}>
          <DataTableQueryOutput
            isInitial={databaseQuery.json.isLoading}
            isFetching={databaseQuery.json.isFetching}
            output={databaseQuery.json.data}
          />
        </Tabs.Content>
        <Tabs.Content value={OutputTabsKey.json}>
          <section className="grid gap-3 lg:grid-cols-[1fr_26rem]">
            <QueryResultDisplay
              isFetching={databaseQuery.json.isFetching}
              displayOutput={formatJsonDisplayOutput(databaseQuery.json.data)}
            />
            <ApiEndpointCard
              format={OutputFormat.json}
              queryUrl={databaseQuery.getFetchUrl()}
            />
          </section>
        </Tabs.Content>
        <Tabs.Content value={OutputTabsKey.csv}>
          <section className="grid gap-3 lg:grid-cols-[1fr_26rem]">
            <QueryResultDisplay
              isFetching={databaseQuery.csv.isFetching}
              displayOutput={formatCsvDisplayOutput(databaseQuery.csv.data)}
            />
            <ApiEndpointCard
              format={OutputFormat.csv}
              queryUrl={databaseQuery.getFetchUrl()}
            />
          </section>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  )
}

interface QueryResultDisplayProps {
  displayOutput: string
  isFetching: boolean
}

function QueryResultDisplay(props: QueryResultDisplayProps) {
  const {displayOutput, isFetching} = props
  return (
    <div className="relative min-h-[15rem]">
      <textarea
        className="h-full w-full resize-none appearance-none overflow-y-auto rounded-lg bg-venice-black-500 p-3 font-mono text-sm text-venice-gray ring-1 ring-inset ring-venice-black-300 placeholder:text-venice-gray-muted focus:outline-none focus:ring-venice-green"
        placeholder="<json output here>"
        value={displayOutput}
        readOnly
        spellCheck={false}
      />
      {isFetching && (
        // right & top matches padding of the textarea
        <CircularProgress className="absolute right-3 top-3 h-4 w-4" />
      )}
    </div>
  )
}

function formatCsvDisplayOutput(data?: QueryData.csv): string {
  if (data == null) {
    return '' // textarea will show placeholder
  }
  if (data === '') {
    return '(no data)'
  }
  return data
}

function formatJsonDisplayOutput(data?: QueryData.json): string {
  return data ? JSON.stringify(data, null, 2) : ''
}

interface DataTableQueryOutputProps {
  isInitial: boolean
  isFetching: boolean
  output?: QueryData.json
}

function DataTableQueryOutput(props: DataTableQueryOutputProps) {
  const {isInitial, isFetching, output} = props
  const columns = useMemo(() => {
    const firstRow = output?.[0]
    return firstRow ? Object.keys(firstRow) : []
  }, [output])

  if (isInitial) {
    return (
      <EmptyDataTable
        title="Select or type in a query and give it a try!"
        containerClassName="min-h-[15rem]"
      />
    )
  }

  if (!output || !output[0]) {
    return (
      <EmptyDataTable
        title="No result found."
        containerClassName="min-h-[15rem]"
      />
    )
  }

  return (
    <div className="max-h-[20rem] overflow-auto">
      <DataTable columns={columns} isFetching={isFetching} rows={output} />
    </div>
  )
}
