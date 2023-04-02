import '@usevenice/app-config/register.node'

import {runAsAdmin, sql} from '../server'
import {Scratchpad} from './scratchpad'

export default async function Home() {
  // This should be made into a trpc function which can be refreshed...
  const res = await runAsAdmin((trxn) =>
    trxn.query<{
      table_name: string
      table_type: 'BASE TABLE' | 'VIEW'
    }>(sql`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `),
  )
  return (
    <Scratchpad
      selectables={res.rows.map((row) => ({
        name: row.table_name,
        type: row.table_type === 'BASE TABLE' ? 'table' : 'view',
      }))}
    />
  )
}
