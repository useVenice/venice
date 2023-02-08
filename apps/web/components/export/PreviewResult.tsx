import {Card} from '@usevenice/ui'
import {BankIcon} from '@usevenice/ui/icons'
import clsx from 'clsx'
import Link from 'next/link'
import type {ReactNode} from 'react'
import type {PreviewQuery} from './usePreviewQuery'

export function PreviewResult(props: PreviewQuery) {
  const {data, isFetching, isInitial} = props
  const {headings, rows, totalCount} = data

  if (isInitial) {
    return isFetching ? (
      <LoadingPreviewResult />
    ) : (
      <EmptyPreviewResult
        title="No results found."
        action={
          <p className="max-w-[14rem] text-center">
            <Link
              className="text-venice-green hover:text-venice-green-darkened"
              href="/connections">
              Please connect more financial institutions.
            </Link>
          </p>
        }
      />
    )
  }

  if (rows.length === 0) {
    return (
      <EmptyPreviewResult
        title="No results found."
        action={
          <p className="max-w-[14rem] text-center">
            <Link
              className="text-venice-green hover:text-venice-green-darkened"
              href="/connections">
              Please connect more financial institutions.
            </Link>
          </p>
        }
      />
    )
  }

  return (
    <>
      <table className="min-w-full divide-y divide-venice-gray-muted">
        <thead>
          <tr>
            {headings.map((c) => (
              <th
                key={c}
                scope="col"
                className="p-2 text-left font-mono text-xs font-normal uppercase text-venice-gray-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={clsx(
            'divide-y divide-venice-gray-muted/50 transition-opacity',
            isFetching && 'opacity-70',
          )}>
          {rows.map((r) => (
            <tr key={r['id']}>
              {headings.map((c) => (
                <td
                  key={c}
                  className="max-w-[25rem] truncate whitespace-nowrap p-2 font-mono text-xs text-offwhite">
                  {/* TODO how to ensure fields are not recursively parsed as object from supabase */}
                  {typeof r[c] === 'object' && r[c] !== null
                    ? JSON.stringify(r[c])
                    : r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-end font-mono text-xs text-venice-gray-muted">
        {rows.length} of {totalCount} shown
      </p>
    </>
  )
}

interface EmptyPreviewResultProps {
  title: string
  action: ReactNode
}

function EmptyPreviewResult(props: EmptyPreviewResultProps) {
  const {title, action} = props
  return (
    <Card>
      <div className="flex flex-col items-center gap-8 p-8">
        <BankIcon className="h-8 w-8 fill-venice-gray-muted" />
        <h3 className="text-venice-gray-muted">{title}</h3>
        {action}
      </div>
    </Card>
  )
}

function LoadingPreviewResult() {
  return (
    <ul className="w-full animate-pulse will-change-auto">
      <LoadingPreviewRow bgColor="bg-venice-black-500" />
      <LoadingPreviewRow bgColor="bg-venice-black-400" />
      <LoadingPreviewRow bgColor="bg-venice-black-300" />
    </ul>
  )
}

interface LoadingPreviewRowProps {
  // tailwind bg-{color}
  bgColor: string
}

function LoadingPreviewRow(props: LoadingPreviewRowProps) {
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
