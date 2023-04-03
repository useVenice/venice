import '@usevenice/app-config/register.node'
import {redirect} from 'next/navigation'

import {runAsAdmin, sql} from '../server'
import {Scratchpad} from './scratchpad'

export async function ScratchpadPage() {
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

export default function Home() {
  redirect('/admin/auth')
  // return (
  //   <h1>
  //     Your Venice deployment is successful. See docs for details on how to use
  //     it
  //   </h1>
  // )
}
