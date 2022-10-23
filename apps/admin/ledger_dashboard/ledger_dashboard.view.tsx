import {Select, Stack, Title} from '@airplane/views'
import {useState} from 'react'

import SelectedTable from './SelectedTable'
import type {TableTitle} from './table'

export const titles = [
  'Accounts',
  'Connections',
  'Institutions',
  'Migrations',
  'Pipelines',
  'Transactions',
]
// Views documentation: https://docs.airplane.dev/views/getting-started
const LedgerDashboard = () => {
  const [table, setTable] = useState<TableTitle>('account')
  return (
    <>
      <Stack>
        <Title>Ledger dashboard</Title>
        <Select
          data={titles}
          placeholder="Select a Table"
          onChange={(title) => setTable(title as TableTitle)}
        />
        <SelectedTable title={table} />
      </Stack>
    </>
  )
}
export default LedgerDashboard
