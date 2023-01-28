import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, {useState} from 'react'

import {Container} from '@usevenice/ui'
import {produce} from '@usevenice/util'

import '@glideapps/glide-data-grid/dist/index.css'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {copyToClipboard} from '../contexts/common-contexts'
import {PageLayout} from '../layouts/PageLayout'

import {VeniceDataGridTheme} from '../styles/themes'
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
  const apiKey = userInfoRes.data?.apiKey
  const databaseUrl: string = userInfoRes.data?.databaseUrl ?? ''
  const tableNames: string[] = userInfoRes.data?.tableNames ?? []

  const [sql, setSql] = useState('SELECT id FROM transaction limit 100')

  const csvUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/sql?format=csv&apiKey=${apiKey}&q=${sql}`
      : null
  const [resultRows, setResultRows] = useState([])

  return (
    <PageLayout title="Data Explorer">
      <Container className="flex-1">
        <div>
          <TextFieldToCopy
            className="mt-0"
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
        <div className="mt-12 flex flex-col gap-2">
          {/* Header */}
          <div className="flex flex-row gap-2">
            <span className="mr-auto text-lg font-bold">Data Explorer</span>
            <button
              className="rounded-lg border border-[#000]/50 bg-green px-4 py-2 text-xs hover:bg-green/90 active:bg-green/75"
              onClick={async () => {
                // @ts-expect-error
                const res = await trpcClient.mutation('executeSql', {sql})
                console.log('executeSql result', res)
                setResultRows(res)
              }}>
              Execute SQL
            </button>
          </div>

          {/* SQL Editor Area */}
          <div className="flex flex-row">
            <div>
              <h3 className="text-sm font-light text-offwhite/50">{`Tables (${tableNames.length})`}</h3>
              <ul>
                {tableNames.map((name) => (
                  <li
                    className="mt-1 cursor-pointer pl-4 font-mono text-sm text-offwhite/75"
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
              className="ml-12 flex-1 resize-none rounded-lg border border-base-content/50 bg-primaryUIControl p-3 font-mono text-offwhite"
              value={sql}
              onChange={(e) => setSql(e.target.value)}></textarea>
          </div>

          {/* SQL Results */}
          <div className="mt-2 max-h-[80vh] overflow-scroll">
            <ResultTableView rows={resultRows} />
          </div>
        </div>
      </Container>
    </PageLayout>
  )
}

/* Text Field w/ Copy Button */

interface TextFieldToCopyProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string
  value: string
  description: string
}

function TextFieldToCopy({
  className = 'mt-8',
  title,
  value,
  description,
}: TextFieldToCopyProps) {
  return (
    <div className={className}>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="relative mt-2 flex flex-row justify-between">
        <input
          className="mr-3 w-full flex-1 rounded-lg border border-base-content/50 bg-primaryUIControl p-2 font-mono text-sm text-offwhite/50"
          value={value}
          disabled></input>
        <div className="absolute inset-y-0 right-0 mr-3 flex items-center space-x-1 pl-3 pr-1">
          <button
            className="relative inline-flex cursor-pointer items-center space-x-2 rounded border border-[#FFF]/10  bg-black px-2.5 py-2 text-center text-xs outline-none outline-0 transition hover:bg-[#222] active:bg-black"
            type="button"
            onClick={() => {
              copyToClipboard(value)
            }}>
            <Image
              src="/copy-icon.svg"
              alt="Copy text"
              width={14}
              height={14}
            />
            <span className="truncate">Copy</span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm">{description}</p>
    </div>
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
      theme={VeniceDataGridTheme}
    />
  )
}
