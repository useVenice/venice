import {Card} from '@usevenice/ui'
import {BankIcon} from '@usevenice/ui/icons'
import clsx from 'clsx'
import type {ReactNode} from 'react'
import {useMemo} from 'react'

interface DataTableProps {
  columns: string[]
  isFetching: boolean
  rows: Array<Record<string, Record<string, unknown> | string | number | null>>
}

export function DataTable(props: DataTableProps) {
  const {columns, isFetching, rows} = props

  const renderedColumns = useMemo(
    () =>
      columns.map((c) => (
        <th
          key={c}
          scope="col"
          className="p-2 text-left font-mono text-xs font-normal uppercase text-venice-gray-muted">
          {c}
        </th>
      )),
    [columns],
  )

  const renderedRows = useMemo(
    () =>
      rows.map((r, i) => (
        <tr key={i}>
          {columns.map((c) => {
            const value = r[c]
            const displayValue =
              typeof value === 'object' && value !== null
                ? JSON.stringify(value)
                : value
            return (
              <td
                key={c}
                className="max-w-[25rem] truncate whitespace-nowrap p-2 font-mono text-xs text-offwhite">
                {displayValue}
              </td>
            )
          })}
        </tr>
      )),
    [columns, rows],
  )

  return (
    <table className="min-w-full divide-y divide-venice-gray-muted">
      <thead>
        <tr>{renderedColumns}</tr>
      </thead>
      <tbody
        className={clsx(
          'divide-y divide-venice-gray-muted/50 overflow-y-auto transition-opacity',
          isFetching && 'opacity-70',
        )}>
        {renderedRows}
      </tbody>
    </table>
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
      <div className="shrink-0 py-2 px-3">{square}</div>
      <div className="flex grow justify-center py-2 px-3">{rect}</div>
      <div className="flex grow justify-center py-2 px-3">{rect}</div>
      <div className="flex grow justify-center py-2 px-3">{rect}</div>
      <div className="flex grow-[3] justify-center py-2 px-3">{rect}</div>
    </li>
  )
}
