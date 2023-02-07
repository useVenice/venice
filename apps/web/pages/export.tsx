import {
  Button,
  Card,
  CircularProgress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@usevenice/ui'

import {
  BankIcon,
  CheckCircleFilledIcon,
  CodeIcon,
  CopyTextIcon,
  DownloadIcon,
  SyncIcon,
} from '@usevenice/ui/icons'

import {useQuery} from '@tanstack/react-query'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {useEffect, useMemo, useState} from 'react'
import clsx from 'clsx'
import {ExternalLink} from '../components/ExternalLink'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {browserSupabase} from '../contexts/common-contexts'

const PREVIEW_LIMIT = 8
const DOWNLOAD_LIMIT = 100

export default function Page() {
  const [selectedTable, selectTable] = useState<string>()
  const preview = usePreviewData(selectedTable)
  return (
    <PageLayout title="Explore Data">
      <PageHeader title={['Explore Data', 'CSV']} />
      <div className="p-6">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="flex items-center gap-4">
            <Select value={selectedTable} onValueChange={selectTable}>
              <SelectTrigger
                className="max-w-[10rem]"
                placeholder="Select a table…"
              />
              <SelectContent>
                <SelectItem value="posting">Posting</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
                <SelectItem value="pipeline">Pipeline</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            {/* TODO fade in & out the loader */}
            {preview.isFetching && <CircularProgress className="h-5 w-5" />}
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="gap-1"
              disabled={!selectedTable}
              onClick={() => downloadCsvData(selectedTable)}>
              <DownloadIcon className="h-4 w-4 fill-current text-offwhite" />
              Download
            </Button>
            <Button asChild className="gap-1">
              <Link href="/api-access">
                <CodeIcon className="h-4 w-4 fill-current text-offwhite" />
                Customize
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 min-h-[15rem] overflow-x-auto">
          <PreviewResult {...preview} />
        </div>
        <div className="mt-6 max-w-[38.5rem]">
          <SyncSpreadsheetCard selectedTable={selectedTable} />
        </div>
      </div>
    </PageLayout>
  )
}

interface PreviewResultProps {
  data: {
    headings: string[]
    rows: Array<Record<string, string | number | null>>
  }
  isFetching: boolean
  isInitial: boolean
}

function PreviewResult(props: PreviewResultProps) {
  const {data, isFetching, isInitial} = props
  const {headings, rows} = data

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

interface SyncSpreadsheetCardProps {
  selectedTable?: string
}

function SyncSpreadsheetCard(props: SyncSpreadsheetCardProps) {
  const {selectedTable} = props
  const googleSheetImport = selectedTable
    ? `=IMPORTDATA(${formatCsvQueryUrl(selectedTable)})`
    : ''
  return (
    <Card>
      <div className="grid gap-6 p-6">
        <h2 className="grid grid-cols-[auto_1fr] items-center gap-2">
          <SyncIcon className="h-5 w-5 fill-current text-venice-gray-muted" />
          <span className="text-base text-offwhite">
            Use Venice to keep your spreadsheets up-to-date
          </span>
        </h2>
        {/* padding left match header's icon size + gap */}
        <div className="grid gap-4 pl-7 text-sm text-venice-gray">
          <section className="grid gap-2">
            <p>
              <span className="text-venice-green">(3 seconds)</span> Google
              Sheets with automatic refresh:
            </p>
            <ol className="grid list-decimal gap-2 pl-8">
              <li>
                In the top left cell of a blank sheet within a Google Sheets
                spreadsheet, paste:
              </li>
              {/* negative margin-left to offset padding of the ordered list */}
              <div className="-ml-4 flex gap-2 py-2">
                <input
                  className="h-8 grow truncate rounded-lg bg-venice-black-400 px-2 font-mono text-xs ring-1 ring-inset ring-venice-black-300 focus:outline-none"
                  value={googleSheetImport}
                  readOnly
                />
                <CopyTextButton content={googleSheetImport} />
              </div>
              <li>
                There is no step 2! Congratulations, your spreadsheet will now
                always be up-to-date with Venice!
              </li>
            </ol>
          </section>
          <section className="grid gap-2">
            <p>
              <span className="text-venice-green">(2 minutes)</span> Microsoft
              Excel with manual refresh:
            </p>
            <p className="pl-4">
              Using Excel, you can treat a Venice CSV file as a local
              &quot;source of truth&quot; which refreshes your spreadsheet every
              time that CSV file is overwritten.{' '}
              <button
                className="text-venice-green hover:text-venice-green-darkened"
                disabled={!selectedTable}
                onClick={() => downloadCsvData(selectedTable)}>
                Download your data as a CSV
              </button>{' '}
              file and then{' '}
              <ExternalLink
                href="https://docs.venice.is"
                className="text-venice-green hover:text-venice-green-darkened">
                read our docs
              </ExternalLink>{' '}
              for more info!
            </p>
          </section>
        </div>
      </div>
    </Card>
  )
}

interface CopyTextButtonProps {
  content: string
}

function CopyTextButton(props: CopyTextButtonProps) {
  const [isCopied, setCopied] = useState(false)
  const {icon: Icon, text} = isCopied
    ? {icon: CheckCircleFilledIcon, text: 'Copied'}
    : {icon: CopyTextIcon, text: 'Copy'}

  async function copyToClipboard() {
    if (navigator) {
      try {
        await navigator.clipboard.writeText(props.content)
        setCopied(true)
      } catch (err) {
        // TODO report via Sentry
        console.error('Unabled to copy content to clipboard.', err)
      }
    }
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
    return
  }, [isCopied])

  return (
    <Button
      variant="primary"
      disabled={isCopied}
      onClick={copyToClipboard}
      className="shrink-0 gap-1 disabled:opacity-100">
      <Icon className="h-4 w-4 fill-current" />
      <span>{text}</span>
    </Button>
  )
}

function usePreviewData(selectedTable?: string): PreviewResultProps {
  const query = useQuery({
    queryKey: ['export.preview', selectedTable],
    queryFn: async () => {
      if (!selectedTable) {
        return []
      }

      const {data, error: postgresError} = await browserSupabase
        .from(selectedTable)
        .select()
        .limit(PREVIEW_LIMIT)

      if (postgresError) {
        throw new Error(postgresError.message)
      }
      return data as Array<Record<string, string | number | null>>
    },
    // don't fetch until a table is selected
    enabled: selectedTable != null,
    keepPreviousData: true,
  })

  const data = useMemo(() => {
    const rows = query.data
    if (rows?.[0]) {
      return {
        // TODO get column names from backend, getting from the first object
        // might not always be correct
        headings: Object.keys(rows[0]),
        rows,
      }
    }
    return {headings: [], rows: []}
  }, [query.data])

  return {
    // since we disable query until a table is selected,
    // isLoading=true means it's the initial state
    isInitial: query.isLoading,
    isFetching: query.isFetching,
    data,
  }
}

const STUB_API_KEY = 'key_01GQHZ4F7GCSFKFWPRZ833PGXP'

function formatCsvQueryUrl(
  table: string,
  option: {download: boolean} = {download: false},
) {
  const url = new URL('/api/sql', window.location.origin)
  const params = new URLSearchParams({
    apiKey: STUB_API_KEY,
    format: 'csv',
    q: `SELECT * FROM ${table} LIMIT ${DOWNLOAD_LIMIT}`,
  })
  if (option.download) {
    params.set('dl', '1')
  }
  return `${url}?${params}`
}

function downloadCsvData(selectedTable?: string): void {
  if (selectedTable) {
    window.open(formatCsvQueryUrl(selectedTable, {download: true}))
  }
}
