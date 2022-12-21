import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import {createClient} from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import React from 'react'

import {VeniceProvider} from '@usevenice/engine-frontend'

import '@glideapps/glide-data-grid/dist/index.css'

import {produce} from '@usevenice/util'

const DataEditor = dynamic(
  () => import('@glideapps/glide-data-grid').then((r) => r.DataEditor),
  {ssr: false},
)

// https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
export const supabase = createClient(
  'https://hhnxsazpojeczkeeifli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobnhzYXpwb2plY3prZWVpZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyNjgwOTIsImV4cCI6MTk3NTg0NDA5Mn0.ZDmf1sjsr-UxW2bPgdj3uaqJNUSqkZh8vCB1phn3qqs',
)

export default function DataPage() {
  const {ledgerId} = VeniceProvider.useContext()
  const [items, setItems] = React.useState([] as any[])
  React.useEffect(() => {
    void supabase
      .from('connection')
      .select('*')
      .eq('ledger_id', ledgerId)
      .then((res) => {
        console.log('res', res)
        setItems(res.data ?? [])
      })
  }, [ledgerId])

  // Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
  const [columns, setColumns] = React.useState([
    {id: 'id', title: 'Id', width: 100},
    {id: 'provider_name', title: 'Provider Name', width: 100},
  ] as GridColumn[])

  // If fetching data is slow you can use the DataEditor ref to send updates for cells
  // once data is loaded.
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
    <div>
      <div>hello world</div>
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
    </div>
  )
}
