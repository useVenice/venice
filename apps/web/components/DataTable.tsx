'use client'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import type {ReactNode} from 'react'
import React from 'react'

import {Card, cn} from '@usevenice/ui'
import {BankIcon} from '@usevenice/ui/icons'
import {produce} from '@usevenice/util'

import '@glideapps/glide-data-grid/dist/index.css'

const DataEditor = dynamic(
  () => import('@glideapps/glide-data-grid').then((r) => r.DataEditor),
  {ssr: false},
)

interface DataTableProps {
  isFetching: boolean
  rows: Array<Record<string, unknown>>
}

export function DataTable({isFetching, rows}: DataTableProps) {
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

  return !columns.length || !rows.length ? (
    isFetching ? (
      <DataTableSkeleton />
    ) : (
      <div className="mt-4">No data available</div>
    )
  ) : (
    <DataEditor
      className={cn(isFetching && 'opacity-70')}
      getCellContent={getData}
      getCellsForSelection={true} // Enables copy
      copyHeaders
      columns={columns}
      rows={rows.length}
      smoothScrollX
      smoothScrollY
      onColumnResize={(col, newSize) => {
        // console.log('col resize', col, newSize)
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
      // theme={VeniceDataGridTheme}
    />
  )
}

interface EmptyDataTableProps {
  title: string
  action?: ReactNode
  containerClassName?: string
}

export function EmptyDataTable(props: EmptyDataTableProps) {
  const {title, action, containerClassName} = props
  return (
    <Card>
      <div
        className={clsx(
          'flex flex-col items-center justify-center gap-8 p-8',
          containerClassName,
        )}>
        <BankIcon className="h-8 w-8 fill-venice-gray-muted" />
        <h3 className="text-venice-gray-muted">{title}</h3>
        {action}
      </div>
    </Card>
  )
}

export function DataTableSkeleton() {
  return (
    <ul className="w-full animate-pulse will-change-auto">
      <DataTableSkeletonRow bgColor="bg-venice-black-500" />
      <DataTableSkeletonRow bgColor="bg-venice-black-400" />
      <DataTableSkeletonRow bgColor="bg-venice-black-300" />
    </ul>
  )
}

interface DataTableSkeletonRowProps {
  // tailwind bg-{color}
  bgColor: string
}

function DataTableSkeletonRow(props: DataTableSkeletonRowProps) {
  const {bgColor} = props
  const square = <div className={clsx('h-4 w-4 rounded', bgColor)} />
  const rect = <div className={clsx('h-4 w-[5rem] rounded', bgColor)} />
  return (
    <li className="flex justify-between border-b border-venice-gray-muted/50">
      <div className="shrink-0 px-3 py-2">{square}</div>
      <div className="flex grow justify-center px-3 py-2">{rect}</div>
      <div className="flex grow justify-center px-3 py-2">{rect}</div>
      <div className="flex grow justify-center px-3 py-2">{rect}</div>
      <div className="flex grow-[3] justify-center px-3 py-2">{rect}</div>
    </li>
  )
}
