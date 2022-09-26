import '@usevenice/app-config/register.node'

import {makePostgresClient} from '@usevenice/core-integration-postgres'
import {z} from '@usevenice/util'

void makePostgresClient({
  databaseUrl: z.string().parse(process.env['POSTGRES_URL']),
}).runMigratorCli()
