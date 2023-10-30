#!/usr/bin/env tsx
import '@usevenice/app-config/register.node'

import path from 'node:path'

import {makePostgresClient} from '@usevenice/integration-postgres'
import {z} from '@usevenice/util'

void makePostgresClient({
  databaseUrl: z.string().parse(process.env['POSTGRES_OR_WEBHOOK_URL']),
  migrationsPath: path.join(__dirname, '../web/migrations'),
  migrationTableName: '_migrations',
}).runMigratorCli()
