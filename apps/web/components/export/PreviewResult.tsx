import {Card} from '@usevenice/ui'
import {BankIcon} from '@usevenice/ui/icons'
import clsx from 'clsx'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {DataTable} from '../DataTable'
import type {PreviewQuery} from './usePreviewQuery'

export function PreviewResult(props: PreviewQuery) {
  const {data, isFetching, isInitial} = props
  const {rows, totalCount} = data

  if (isInitial) {
    return <LoadingPreviewResult />
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
      <DataTable isFetching={isFetching} rows={rows} />
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
