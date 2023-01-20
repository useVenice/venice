import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'

import {Container} from '@usevenice/ui'
import {produce} from '@usevenice/util'

import '@glideapps/glide-data-grid/dist/index.css'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {PageContainer} from '../components/common-components'
import {copyToClipboard} from '../contexts/common-contexts'

const DataEditor = dynamic(
  () => import('@glideapps/glide-data-grid').then((r) => r.DataEditor),
  {ssr: false},
)

export default function DataExplorerScreen() {
  const {trpcClient, trpc, userId} = VeniceProvider.useContext()

  // @ts-expect-error
  const userInfoRes = trpc.useQuery(['userInfo', {}], {
    enabled: !!userId,
  })
  // @ts-expect-error
  const apiKey = userInfoRes.data?.apiKey
  // @ts-expect-error
  const databaseUrl: string = userInfoRes.data?.databaseUrl ?? ''
  // @ts-expect-error
  const tableNames: string[] = userInfoRes.data?.tableNames ?? []

  const [sql, setSql] = useState('SELECT id FROM transaction limit 100')

  const csvUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/sql?format=csv&apiKey=${apiKey}&q=${sql}`
      : null
  const [resultRows, setResultRows] = useState([])

  return (
    <PageContainer title="Data Explorer">
      <Container className="flex-1">
        <div>
          <TextFieldToCopy
            title="Database URI"
            value={databaseUrl}
            description="Build custom queries and connect to your favorite
                         dashboard tools to visualize your financial data"
          />

          <TextFieldToCopy
            title="CSV Export"
            value={csvUrl ?? ''}
            description="Tip: Use with Google Sheet's IMPORTDATA function to pipe
                         data from Venice live into your spreadsheets"
          />
        </div>

        {/* Data Explorer */}
        <div className="mt-12 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-row gap-2">
            <span className="mr-auto text-lg font-bold">Data Explorer</span>
            <button
              className="btn"
              onClick={async () => {
                // @ts-expect-error
                const res = await trpcClient.mutation('executeSql', {sql})
                console.log('executeSql result', res)
                setResultRows(res)
              }}>
              Execute SQL
            </button>
            <button
              className="btn"
              onClick={async () => {
                // @ts-expect-error
                const res = await trpcClient.mutation('createDbUser', {})
                console.log('createDbUser result', res)
                setResultRows(res)
              }}>
              create db user
            </button>
          </div>

          {/* SQL Editor Area */}
          <div className="flex flex-row">
            <div>
              <h3 className="font-bold">Tables</h3>
              <ul>
                {tableNames.map((name) => (
                  <li
                    key={name}
                    onClick={async () => {
                      const newSql = `SELECT * FROM ${name} LIMIT 10`
                      setSql(newSql)
                      // @ts-expect-error
                      const res = await trpcClient.mutation('executeSql', {
                        sql: newSql,
                      })
                      console.log('executeSql result', res)
                      setResultRows(res)
                    }}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <textarea
              className="ml-4 flex-1 rounded-lg border border-base-content/25 bg-tableRow p-3 text-offwhite"
              value={sql}
              onChange={(e) => setSql(e.target.value)}></textarea>
          </div>

          {/* SQL Results */}
          <div className="max-h-[80vh] overflow-scroll">
            <ResultTableView rows={resultRows} />
          </div>
        </div>
      </Container>
    </PageContainer>
  )
}

/* Text Field w/ Copy Button */

interface TextFieldToCopyProps {
  title: string
  value: string
  description: string
}

function TextFieldToCopy({title, value, description}: TextFieldToCopyProps) {
  return (
    <>
      <h2 className="mt-8 text-lg font-bold">{title}</h2>
      <div className="relative mt-2 flex flex-row justify-between">
        <input
          className="mr-3 w-full flex-1 rounded-lg border border-base-content/50 bg-tableRow p-2 text-sm text-offwhite/50"
          value={value}
          disabled></input>
        <div className="absolute inset-y-0 right-0 mr-3 flex items-center space-x-1 pl-3 pr-1">
          <button
            className="relative inline-flex cursor-pointer items-center space-x-2 rounded bg-venice-black px-2.5 py-2 text-center text-xs outline-none outline-0 transition-all duration-200 ease-out focus-visible:outline-4 focus-visible:outline-offset-1"
            type="button"
            onClick={() => {
              copyToClipboard(value)
            }}>
            {/* Todo: replace this with our own */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="truncate">Copy</span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm">{description}</p>
    </>
  )
}

/* Data Grid */

export function ResultTableView({rows}: {rows: Array<Record<string, any>>}) {
  // Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides

  const [columns, setColumns] = React.useState<GridColumn[]>([])
  React.useLayoutEffect(() => {
    setColumns(
      Object.keys(rows[0] ?? {}).map(
        (key): GridColumn => ({id: key, title: key}),
      ),
    )
  }, [rows])

  // If fetching data is slow you can use the DataEditor ref to send updates for cells
  // once data is loaded.

  function getData([colIdx, rowIdx]: Item): GridCell {
    const col = columns[colIdx]!
    // if (!col) {
    //   debugger
    //   console.error('missing column', colIdx)
    // }
    const row = rows[rowIdx]!
    const cell = row[col.id!]
    const data = !cell
      ? ''
      : typeof cell === 'string'
      ? cell
      : JSON.stringify(cell)

    // Unfortunately copying of JSON value is really not going to work well
    // as they are escaped poorly for our purposes...
    // @see https://github.com/glideapps/glide-data-grid/blob/main/packages/core/src/data-editor/data-editor-fns.ts#L232-L263
    return {
      kind: GridCellKind.Text,
      allowOverlay: false,
      data,
      displayData: data,
    }
  }

  return !columns.length ? null : (
    <DataEditor
      getCellContent={getData}
      getCellsForSelection={true} // Enables copy
      copyHeaders
      columns={columns}
      rows={rows.length}
      smoothScrollX
      smoothScrollY
      onColumnResize={(col, newSize) => {
        console.log('col resize', col, newSize)
        setColumns((existing) =>
          produce(existing, (draft) => {
            const c = draft.find((c) => c.id === col.id)
            if (c) {
              // @ts-expect-error
              c.width = newSize
            }
          }),
        )
      }}
    />
  )
}
