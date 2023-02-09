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
  CheckCircleFilledIcon,
  CodeIcon,
  CopyTextIcon,
  DownloadIcon,
  SyncIcon,
} from '@usevenice/ui/icons'

import type {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {PreviewResult, usePreviewQuery} from '../components/export'
import {ExternalLink} from '../components/ExternalLink'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

const PREVIEW_LIMIT = 8

interface ServerSideProps {
  apiKey: string
  serverUrl: string
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  const {serverGetUser} = await import('../server')
  const user = await serverGetUser(ctx)

  const {z} = await import('@usevenice/util')
  const apiKey = z.string().parse(user?.user_metadata?.['apiKey'])
  const serverUrl = commonEnv.NEXT_PUBLIC_SERVER_URL

  return {
    props: {apiKey, serverUrl},
  }
}

export default function Page(props: ServerSideProps) {
  const {apiKey, serverUrl} = props
  const [selectedTable, selectTable] = useState('transaction')

  const preview = usePreviewQuery({limit: PREVIEW_LIMIT, table: selectedTable})
  const isEmptyResult = preview.data.isEmpty

  const csvQuery = useCsvQuery({
    apiKey,
    serverUrl,
    table: selectedTable,
  })

  return (
    <PageLayout title="Explore Data">
      <PageHeader title={['Explore Data', 'CSV']} />
      <div className="p-6">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="flex items-center gap-4">
            <Select value={selectedTable} onValueChange={selectTable}>
              <SelectTrigger className="max-w-[10rem]" />
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
              disabled={isEmptyResult}
              onClick={() => window.open(csvQuery.downloadUrl)}>
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
          <SyncSpreadsheetCard
            csvQuery={csvQuery}
            isEmptyResult={isEmptyResult}
          />
        </div>
      </div>
    </PageLayout>
  )
}

interface SyncSpreadsheetCardProps {
  csvQuery: CsvQuery
  isEmptyResult: boolean
}

function SyncSpreadsheetCard(props: SyncSpreadsheetCardProps) {
  const {csvQuery, isEmptyResult} = props
  const googleSheetImport = `=IMPORTDATA(${csvQuery.apiEndpoint})`
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
                  className="h-8 grow truncate rounded-lg bg-venice-black-400 px-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
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
                className="text-venice-green hover:text-venice-green-darkened disabled:cursor-default disabled:hover:text-venice-green"
                disabled={isEmptyResult}
                onClick={() => window.open(csvQuery.downloadUrl)}>
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
        console.error('Unable to copy content to clipboard.', err)
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

interface CsvQuery {
  apiEndpoint: string
  downloadUrl: string
}

function useCsvQuery({
  apiKey,
  serverUrl,
  table,
}: {
  apiKey: string
  serverUrl: string
  table: string
}): CsvQuery {
  const baseUrl = new URL(serverUrl)
  const url = new URL('/api/sql', baseUrl)
  const params = new URLSearchParams({
    apiKey,
    format: 'csv',
    q: `SELECT * FROM ${table}`,
  })

  const downloadParams = new URLSearchParams(params)
  downloadParams.set('dl', '1')

  return {
    apiEndpoint: `${url}?${params}`,
    downloadUrl: `${url}?${downloadParams}`,
  }
}
