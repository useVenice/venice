import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {useSelect} from 'react-supabase'

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

export function ResultTableView() {
  const [accountsRes] = useSelect('account')
  console.log('accounts', accountsRes.data)

  // const [transactionsRes] = useSelect('transaction')
  // console.log('transactions', transactionsRes.data)

  // Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
  const [columns, setColumns] = React.useState([
    {id: 'id', title: 'Id', width: 100},
    {id: 'provider_name', title: 'Provider Name', width: 100},
  ] as GridColumn[])

  // If fetching data is slow you can use the DataEditor ref to send updates for cells
  // once data is loaded.

  const items = accountsRes.data ?? []
  function getData([colIdx, rowIdx]: Item): GridCell {
    const col = columns[colIdx]!
    const row = items[rowIdx]!
    return {
      kind: GridCellKind.Text,
      data: row[col.id!] ?? '<empty>',
      allowOverlay: false,
      displayData: row[col.id!] ?? '<empty>',
    }
  }

  return (
    <DataEditor
      getCellContent={getData}
      columns={columns}
      rows={items.length}
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
  const {trpcClient, trpc} = VeniceProvider.useContext()

  // @ts-expect-error
  const userInfoRes = trpc.useQuery(['userInfo', {}])
  // @ts-expect-error
  const databaseUrl = userInfoRes.data?.databaseUrl

  const [sql, setSql] = useState('SELECT * FROM account')
  const [result, setResult] = useState('[\n  {\n    "count": 21\n  }\n]')

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
                setResult(JSON.stringify(res, null, 2))
              }}>
              Execute SQL
            </button>
            <button
              className="btn"
              onClick={async () => {
                // @ts-expect-error
                const res = await trpcClient.mutation('createDbUser', {})
                console.log('createDbUser result', res)
                setResult(JSON.stringify(res, null, 2))
              }}>
              create db user
            </button>
          </div>
          {/* Sql editor area */}
          <div className="flex flex-row">
            <div>
              <h3 className="font-bold">Tables</h3>
              <ul>
                <li>Accounts</li>
                <li>Transactions</li>
                <li>Commodities</li>
              </ul>
            </div>
            <textarea
              className="ml-4 flex-1 border"
              value={sql}
              onChange={(e) => setSql(e.target.value)}></textarea>
          </div>
          {/* Result */}
          <div className="h-96 overflow-scroll">
            <pre>{result}</pre>
          </div>
        </div>
      </Container>
    </PageContainer>
  )
}
