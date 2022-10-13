import {Stack, Table, Title} from '@airplane/views'

// Views documentation: https://docs.airplane.dev/views/getting-started
const LedgerDashboard = () => (
  <>
    <Stack>
      <Title>Ledger dashboard</Title>
      <Table title="Accounts" task="list_accounts" />
      <Table title="Connections" task="list_connections" />
      <Table title="Institutions" task="list_institutions" />
      <Table title="Migrations" task="list_migrations" />
      <Table title="Pipelines" task="list_pipelines" />
      <Table title="Transactions" task="list_transactions" />
    </Stack>
  </>
)

export default LedgerDashboard
