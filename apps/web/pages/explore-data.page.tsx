import {
  getRestEndpoint,
  kAcceptUrlParam,
  xPatUrlParamKey,
} from '@usevenice/app-config/constants'
import {
  Button,
  CircularProgress,
  Input,
  InstructionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@usevenice/ui'

import {CodeIcon, SyncIcon} from '@usevenice/ui/icons'
import {joinPath} from '@usevenice/util'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useState} from 'react'
import {CopyTextButton} from '../components/CopyTextButton'
import {PreviewResult, usePreviewQuery} from '../components/export'
import {ExternalLink} from '../components/ExternalLink'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {ensurePersonalAccessToken, serverGetUser} from '../server'

const PREVIEW_LIMIT = 10

export const getServerSideProps = (async (ctx) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }
  const pat = await ensurePersonalAccessToken(user.id)
  return {props: {pat}}
}) satisfies GetServerSideProps

export default function ExploreDataPage({
  pat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedTable, selectTable] = useState('transaction')

  const preview = usePreviewQuery({limit: PREVIEW_LIMIT, table: selectedTable})

  const csvUrl = getRestEndpoint(null)
  csvUrl.pathname = joinPath(csvUrl.pathname, selectedTable)
  csvUrl.searchParams.set(xPatUrlParamKey, pat)
  csvUrl.searchParams.set(kAcceptUrlParam, 'csv')

  return (
    <PageLayout title="Explore Data">
      <PageHeader title={['Explore Data']} />
      <div className="p-6">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="flex items-center gap-4">
            <Select value={selectedTable} onValueChange={selectTable}>
              <SelectTrigger className="max-w-[13rem]" />
              <SelectContent>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="transaction_split">
                  Transaction Split
                </SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
                <SelectItem value="pipeline">Pipeline</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            {/* TODO fade in & out the loader */}
            {preview.isFetching && <CircularProgress className="h-5 w-5" />}
          </div>
          <div className="flex gap-2">
            <Button asChild className="gap-1">
              <Link href="/api-access">
                <CodeIcon className="h-4 w-4 fill-current text-offwhite" />
                Explore APIs
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 min-h-[15rem] overflow-x-auto">
          <PreviewResult {...preview} />
        </div>
        <div className="mt-6 max-w-[50rem]">
          <SyncSpreadsheetCard
            csvUrl={csvUrl.href}
            isEmptyResult={preview.data.isEmpty}
          />
        </div>
      </div>
    </PageLayout>
  )
}

interface SyncSpreadsheetCardProps {
  csvUrl: string
  isEmptyResult: boolean
}

function SyncSpreadsheetCard(props: SyncSpreadsheetCardProps) {
  const {csvUrl: csvQuery, isEmptyResult} = props
  const googleSheetImport = `=IMPORTDATA("${csvQuery}")`
  return (
    <InstructionCard icon={SyncIcon} title="Explore your data in a spreadsheet">
      <section className="grid gap-2">
        <p>
          <span className="text-venice-green">(3 seconds)</span> Google Sheets
          with automatic refresh:
        </p>
        <ol className="grid list-decimal gap-2 pl-8">
          <li>
            In the top left cell of a blank sheet within a Google Sheets
            spreadsheet, paste:
          </li>
          {/* negative margin-left to offset padding of the ordered list */}
          <div className="-ml-4 flex gap-2 py-2">
            <Input
              className="grow truncate"
              value={googleSheetImport}
              readOnly
            />
            <CopyTextButton content={googleSheetImport} />
          </div>
          <li>
            Check out the{' '}
            <Link
              className="text-venice-green hover:text-venice-green-darkened"
              href="https://postgrest.org/en/stable/api.html#">
              PostgREST
            </Link>{' '}
            docs for url parameters you can use to adjust the response fields
            and shape. Can even do powerful things such as joins!
          </li>
          <li>
            There is no step 3! Congratulations, your spreadsheet will now
            always be up-to-date with Venice!
          </li>
        </ol>
      </section>
      <section className="grid gap-2">
        <p>
          <span className="text-venice-green">(2 minutes)</span> Microsoft Excel
          with manual refresh:
        </p>
        <p className="pl-4">
          Using Excel, you can treat a Venice CSV file as a local &quot;source
          of truth&quot; which refreshes your spreadsheet every time that CSV
          file is overwritten.{' '}
          <button
            className="text-venice-green hover:text-venice-green-darkened disabled:cursor-default disabled:hover:text-venice-green"
            disabled={isEmptyResult}
            onClick={() => window.open(csvQuery)}>
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
    </InstructionCard>
  )
}
