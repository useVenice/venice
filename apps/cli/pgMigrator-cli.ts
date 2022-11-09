#!/usr/bin/env tsx
import '@usevenice/app-config/register.node'

import {makePostgresClient} from '@usevenice/core-integration-postgres'
import {z} from '@usevenice/util'

void makePostgresClient({
  databaseUrl: z.string().parse(process.env['POSTGRES_OR_WEBHOOK_URL']),
}).runMigratorCli()
