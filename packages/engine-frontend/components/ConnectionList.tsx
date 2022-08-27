import {Card, VStack} from '@ledger-sync/uikit'
import {useLedgerSync} from '../useLedgerSync'

// Hmm maybe have envName in both place
export function ConnectionList(ctx: {ledgerId: string}) {
  const {connectionsRes} = useLedgerSync({
    ledgerId: ctx.ledgerId,
    envName: 'sandbox', // Add control for me...
  })

  // console.log('ls.listIntegrationsRes.data', ls.listIntegrationsRes.data)
  return (
    <VStack gap="sm">
      {connectionsRes.data?.map((conn) => (
        <Card title={(conn as any).settings.institution.name}>
          <img
            src={`data:image/png;base64,${
              (conn as any).settings.institution.logo
            }`}
          />
          <pre>{JSON.stringify(conn, null, 2)}</pre>
        </Card>
      ))}
    </VStack>
  )
}
