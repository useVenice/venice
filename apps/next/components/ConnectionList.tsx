import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {Card} from '@supabase/ui'
import {tw} from 'twind'

// Hmm maybe have envName in both place
export function ConnectionList(ctx: {ledgerId: string}) {
  const {connectionsRes} = useLedgerSync({
    ledgerId: ctx.ledgerId,
    envName: 'sandbox', // Add control for me...
  })
  // console.log('ls.listIntegrationsRes.data', ls.listIntegrationsRes.data)
  return (
    <div className={tw`flex flex-col space-y-4`}>
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
    </div>
  )
}
