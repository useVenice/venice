import '@ledger-sync/app-config/register.node'

import {makePostgresClient} from '@ledger-sync/core-integration-postgres'
import {z} from '@ledger-sync/util'

void makePostgresClient({
  databaseUrl: z.string().parse(process.env['POSTGRES_URL']),
}).runMigratorCli()
