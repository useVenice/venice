import {
  Button,
  CircularProgress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@usevenice/ui'

import {CodeIcon} from '@usevenice/ui/icons'
import Link from 'next/link'
import {useState} from 'react'
import {PreviewResult, usePreviewQuery} from '../components/export'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

const PREVIEW_LIMIT = 100

export default function ExploreDataPage() {
  const [selectedTable, selectTable] = useState('transaction')

  const preview = usePreviewQuery({limit: PREVIEW_LIMIT, table: selectedTable})

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
      </div>
    </PageLayout>
  )
}
