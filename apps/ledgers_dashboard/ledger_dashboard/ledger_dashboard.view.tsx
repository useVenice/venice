import {Stack, Table, Title} from '@airplane/views'

// Views documentation: https://docs.airplane.dev/views/getting-started
const LedgerDashboard = () => (
  <Stack>
    <Title>Ledger dashboard</Title>
    <Table title="Connections" task="list_connections" />
  </Stack>
)

export default LedgerDashboard
