import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'

import {Container} from '@usevenice/ui'
import {produce} from '@usevenice/util'

import '@glideapps/glide-data-grid/dist/index.css'

import {Database} from 'phosphor-react'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {PageContainer} from '../components/common-components'
import {copyToClipboard} from '../contexts/common-contexts'

const DataEditor = dynamic(
  () => import('@glideapps/glide-data-grid').then((r) => r.DataEditor),
  {ssr: false},
)

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

export default function DataExplorerScreen() {
  const {trpcClient, trpc, userId} = VeniceProvider.useContext()

  // @ts-expect-error
  const userInfoRes = trpc.useQuery(['userInfo', {}], {
    enabled: !!userId,
  })
  // @ts-expect-error
  const apiKey = userInfoRes.data?.apiKey
  // @ts-expect-error
  const databaseUrl = userInfoRes.data?.databaseUrl
  // @ts-expect-error
  const tableNames: string[] = userInfoRes.data?.tableNames ?? []

  const [sql, setSql] = useState('SELECT id FROM transaction limit 100')
  const csvUrl = `${window.location.origin}/api/sql?format=csv&apiKey=${apiKey}&q=${sql}`
  const [resultRows, setResultRows] = useState([])

  return (
    <PageContainer authenticated>
      <Container className="flex-1">
        <div>
          <h2 className="mb-3 text-lg font-bold">Database</h2>
          <div className="mb-3 flex flex-row justify-between">
            <input
              className="mr-3 flex-1 border p-3"
              value={databaseUrl}
              disabled></input>
            <button
              className="btn"
              onClick={() => {
                copyToClipboard(databaseUrl)
              }}>
              Copy
            </button>
          </div>
          <p>
            <Database className="inline" />
            Venice is your unified financial database. Pipe data in from
            thousands of sources, and then perform custom analyses or build an
            entire app on top of it.
          </p>
        </div>

        {/* Data explorer */}
        <div className="mt-4 flex flex-col gap-4">
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
          {/* Sql editor area */}
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
              className="ml-4 flex-1 border"
              value={sql}
              onChange={(e) => setSql(e.target.value)}></textarea>
          </div>
          {/* Result */}
          {/* <div className="h-96 overflow-scroll">
            <pre>{result}</pre>
          </div> */}
          <div className="max-h-[80vh] overflow-scroll">
            <div>
              <a href={csvUrl} className="link">
                CSV Link to result
              </a>
              <span className="ml-2">
                (Tip: Use with Google Sheet IMPORTDATA function to data from
                Venice live in your spreadsheets)
              </span>
            </div>
            <ResultTableView rows={resultRows} />
          </div>
        </div>
      </Container>
    </PageContainer>
  )
}
