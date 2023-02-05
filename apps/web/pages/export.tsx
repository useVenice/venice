import {
  Button,
  Card,
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

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {ExternalLink} from '../components/ExternalLink'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

export default function Page() {
  const [selectedQuery, selectQuery] = useState<string>()
  const data = useFakeData(selectedQuery)
  return (
    <PageLayout title="Explore Data">
      <PageHeader title={['Explore Data', 'CSV']} />
      <div className="p-6">
        <div className="grid grid-cols-[1fr_auto]">
          <Select value={selectedQuery} onValueChange={selectQuery}>
            <SelectTrigger
              className="max-w-[10rem]"
              placeholder="placeholder…"
            />
            <SelectContent>
              <SelectItem value="posting">Posting</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
              <SelectItem value="institution">Institution</SelectItem>
              <SelectItem value="pipeline">Pipeline</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="primary" className="gap-1">
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
        <div className="mt-6 overflow-x-auto">
          <DataPreviewTable data={data} />
        </div>
        <div className="mt-12 max-w-[38.5rem]">
          <SyncSpreadsheetCard />
        </div>
      </div>
    </PageLayout>
  )
}

interface DataPreviewTableProps {
  data: {
    headings: string[]
    rows: Array<Record<string, string | number | null>>
  }
}

function DataPreviewTable(props: DataPreviewTableProps) {
  const {headings, rows} = props.data

  if (rows.length === 0) {
    return (
      <div className="grid min-h-[15rem] place-items-center">
        <p className="font-mono text-lg text-venice-gray-muted">
          Placeholder - Empty State - No data
        </p>
      </div>
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
      <tbody className="divide-y divide-venice-gray-muted/50">
        {rows.map((r) => (
          <tr key={r['id']}>
            {headings.map((c) => (
              <td
                key={c}
                className="max-w-[25rem] truncate whitespace-nowrap p-2 font-mono text-xs text-offwhite">
                {r[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SyncSpreadsheetCard() {
  const inputValue =
    '=IMPORTDATA(https://app.venice.is/api/sql?format=csv&something=something'
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
                  value={inputValue}
                  readOnly
                />
                <CopyTextButton content={inputValue} />
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
              <button className="text-venice-green hover:text-venice-green-darkened">
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
  const [isCopied, setCopied] = useState(true)
  const {icon: Icon, text} = isCopied
    ? {icon: CheckCircleFilledIcon, text: 'Copied'}
    : {icon: CopyTextIcon, text: 'Copy'}

  async function copyToClipboard() {
    console.log('copy!')
    if (navigator) {
      await navigator.clipboard.writeText(props.content)
      setCopied(true)
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

function useFakeData(query?: string): {
  headings: string[]
  rows: Array<Record<string, string | number | null>>
} {
  switch (query) {
    case 'institution':
      return {
        headings: ['id', 'standard', 'external', 'provider_name'],
        rows: [
          {
            id: 'ins_plaid_ins_13',
            standard: '{}',
            external:
              '{"url": "https://www.pnc.com","logo": "iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAMAAAAvHNATAAAABGdBTUEAALGPC=","name": "PNC","oauth": false,"products":["assets","balance","transactions","credit_details","income","identity","investments","liabilities"]}',
            provider_name: 'plaid',
          },
          {
            id: 'ins_plaid_ins_20',
            standard: '{}',
            external: '{url: "https://www.citizensbank.com"}',
            provider_name: 'plaid',
          },
          {
            id: 'ins_plaid_ins_10',
            standard: '{}',
            external: '{url: "https://www.americanexpress.com/"}',
            provider_name: 'plaid',
          },
          {
            id: 'ins_plaid_ins_5',
            standard: '{}',
            external: '{url: "https://www.citi.com"}',
            provider_name: 'plaid',
          },
          {
            id: 'ins_plaid_ins_109508',
            standard: '{}',
            external: '{url: "https://www.platypus.com"}',
            provider_name: 'plaid',
          },
        ],
      }
    case 'transaction':
      return {
        headings: [
          'id',
          'date',
          'description',
          'payee',
          'amount_quantity',
          'amount_unit',
        ],
        rows: [
          {
            id: 'txn_plaid_MDnKQZAk4jFraay3X7rlTyZqevXw1qSeWQrmv',
            date: '2023-01-28',
            description: 'United Airlines',
            payee: 'United Airlines',
            amount_quantity: '500',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_gWDmxJ81XPTNRRlA6BNxuGkZ8J5VvZi46KJyl',
            date: '2023-01-28',
            description: 'Touchstone Climbing',
            payee: null,
            amount_quantity: '-78.5',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_Ae4779deBlHoGpya79JBU7g9Lp17gEio7DGyX',
            date: '2023-01-28',
            description: 'United Airlines',
            payee: 'United Airlines',
            amount_quantity: '500',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_yjDmmboj8aslJRGp3dnKUdov6LydoWFD9mN5d',
            date: '2023-01-28',
            description: 'Touchstone Climbing',
            payee: null,
            amount_quantity: '-78.5',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_xPRbbXpPQdI1kMomLRJJiJNLLnN8vEcJExBbg',
            date: '2023-01-29',
            description: 'CD DEPOSIT .INITIAL.',
            payee: null,
            amount_quantity: '-1000',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_aMPxx3wMmEu9bEQ5z8WWC1p77dpQgvi1983MG',
            date: '2023-01-29',
            description: 'ACH Electronic CreditGUSTO PAY 123456',
            payee: null,
            amount_quantity: '-5850',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_KEy88VMEleHJ9Na1ylzXtR4jBB9vzxCm6rejr',
            date: '2023-01-30',
            description: 'Uber 063015 SF**POOL**',
            payee: 'Uber',
            amount_quantity: '-5.4',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_xPRbbXpPQdI1kMomLRJrulKzRR1j5DuA9LxZr',
            date: '2023-01-30',
            description: 'CREDIT CARD 3333 PAYMENT *//',
            payee: null,
            amount_quantity: '-25',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_Bbo3B5Q7ZDCjGGkMbWjwHXjBJoo8gQCLMwLNe',
            date: '2023-01-29',
            description: 'CD DEPOSIT .INITIAL.',
            payee: null,
            amount_quantity: '-1000',
            amount_unit: 'USD',
          },
          {
            id: 'txn_plaid_xn6Q8XPzqguz669J7ozyc75M3GG4ZvUA4nAvx',
            date: '2023-01-29',
            description: 'ACH Electronic CreditGUSTO PAY 123456',
            payee: null,
            amount_quantity: '-5850',
            amount_unit: 'USD',
          },
        ],
      }
    default:
      return {headings: [], rows: []}
  }
}
