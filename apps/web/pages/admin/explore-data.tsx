import {
  getRestEndpoint,
  kAcceptUrlParam,
  kApikeyUrlParam,
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

import {CodeIcon, DownloadIcon, SyncIcon} from '@usevenice/ui/icons'
import {joinPath} from '@usevenice/util'
import type {InferGetServerSidePropsType} from 'next'
import type {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useState} from 'react'
import {CopyTextButton} from '../../components/CopyTextButton'
import {PreviewResult, usePreviewQuery} from '../../components/export'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {ensurePersonalAccessToken, serverGetUser} from '../../server'

const PREVIEW_LIMIT = 10

export const getServerSideProps = (async (ctx) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/admin/auth',
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
  csvUrl.searchParams.set(kApikeyUrlParam, pat)
  csvUrl.searchParams.set(kAcceptUrlParam, 'csv')

  return (
    <PageLayout title="Explore Data" auth="user">
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
          <SyncSpreadsheetCard csvUrl={csvUrl.href} />
        </div>
      </div>
    </PageLayout>
  )
}

interface SyncSpreadsheetCardProps {
  csvUrl: string
}

function SyncSpreadsheetCard(props: SyncSpreadsheetCardProps) {
  const {csvUrl} = props
  const googleSheetImport = `=IMPORTDATA("${csvUrl}")`
  return (
    <InstructionCard icon={SyncIcon} title="Explore your data in a spreadsheet">
      <section className="grid gap-2">
        <p>
          <span className="text-venice-green">(Continuous)</span> Google Sheets
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
            There is no step 2! Congratulations, your spreadsheet will now
            always be up-to-date with Venice!
          </li>
        </ol>
      </section>
      <section className="grid gap-2">
        <p>
          <span className="text-venice-green">(One time)</span> Download csv as
          one time export
        </p>
        <p className="pl-4">
          <div className="-ml-4 flex gap-2 py-2">
            <Input className="grow truncate" value={csvUrl} readOnly />
            <Button
              variant="primary"
              className="shrink-0 gap-1 disabled:opacity-100">
              <DownloadIcon className="h-4 w-4 fill-current" />
              <Link target="_blank" href={csvUrl}>
                Open
              </Link>
            </Button>
            <CopyTextButton content={csvUrl} />
          </div>
        </p>
      </section>
      <section className="grid gap-2">
        <p>
          <span className="text-venice-green">
            Customizing the csv response
          </span>
        </p>
        <p>
          The csv url is just our rest API with url param `_accept=csv` added.
          Check out the{' '}
          <Link
            className="text-venice-green hover:text-venice-green-darkened"
            href="https://postgrest.org/en/stable/api.html#">
            PostgREST
          </Link>{' '}
          docs for url parameters you can use to adjust the response fields and
          shape. Can even do powerful things such as joins!
        </p>
      </section>
    </InstructionCard>
  )
}
