// import {Card} from '@usevenice/ui'
import {CircularProgress} from '@usevenice/ui'
import {ApiEndpointCard} from './ApiEndpointCard'

interface QueryOutputProps {
  isFetching: boolean
  query?: string
  serverUrl: string
}

export function DataTableQueryOutput<T extends {}>(
  props: QueryOutputProps & {output?: T[]},
) {
  console.log(props)
  return <p>Data Table … to implement</p>
}

export function JsonQueryOutput(props: QueryOutputProps & {output?: unknown}) {
  const {isFetching, output, query, serverUrl} = props
  const q = encodeURIComponent(query ?? '')
  const queryUrl = `${serverUrl}/api/sql?format=json&apiKey=key_abcd1234&q=${q}`

  return (
    <section className="grid grid-cols-[1fr_26rem] gap-3">
      <div className="relative">
        <textarea
          className="h-full w-full resize-none appearance-none overflow-y-auto rounded-lg bg-venice-black-500 p-3 font-mono text-sm text-venice-gray ring-1 ring-inset ring-venice-black-300 placeholder:text-venice-gray-muted focus:outline-none focus:ring-venice-green"
          placeholder="<json output here>"
          value={output ? JSON.stringify(output, null, 2) : ''}
          readOnly
          spellCheck={false}
        />
        {isFetching && (
          // right & top matches padding of the textarea
          <CircularProgress className="absolute right-3 top-3 h-4 w-4" />
        )}
      </div>
      <ApiEndpointCard format="json" queryUrl={queryUrl} />
    </section>
  )
}

export function CsvQueryOutput(props: QueryOutputProps & {output?: string}) {
  const {isFetching, output, query, serverUrl} = props
  const q = encodeURIComponent(query ?? '')
  const queryUrl = `${serverUrl}/api/sql?format=csv&apiKey=key_abcd1234&q=${q}`

  let displayOutput: string
  if (output == null) {
    displayOutput = '' // textarea will show placeholder
  } else if (output === '') {
    displayOutput = '(no data)'
  } else {
    displayOutput = output
  }

  return (
    <section className="grid grid-cols-[1fr_26rem] gap-3">
      <div className="relative">
        <textarea
          className="h-full w-full resize-none appearance-none overflow-y-auto rounded-lg bg-venice-black-500 p-3 font-mono text-sm text-venice-gray ring-1 ring-inset ring-venice-black-300 placeholder:text-venice-gray-muted focus:outline-none focus:ring-venice-green"
          placeholder="<csv output here>"
          value={displayOutput}
          readOnly
          spellCheck={false}
        />
        {isFetching && (
          // right & top matches padding of the textarea
          <CircularProgress className="absolute right-3 top-3 h-4 w-4" />
        )}
      </div>
      <ApiEndpointCard format="csv" queryUrl={queryUrl} />
    </section>
  )
}
