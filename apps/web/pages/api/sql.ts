import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {
  backendEnv,
  makePostgresClient,
  Papa,
} from '@usevenice/app-config/backendConfig'
import {R, z} from '@usevenice/util'

import {respondToCORS} from './trpc/[...trpc]'

const adminClient = makePostgresClient({
  databaseUrl: backendEnv.POSTGRES_OR_WEBHOOK_URL,
})
const {sql} = adminClient

export default R.identity<NextApiHandler>(async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }
  const {q, apiKey} = req.query
  if (!q) {
    res.status(400).send('sql query param q is required')
    return
  }

  const format = z
    .enum(['csv', 'json'])
    .default('json')
    .parse(req.query['format'])

  if (!apiKey) {
    res.status(401).send('apiKey required')
    return
  }

  const adminPool = await adminClient.getPool()
  // TODO: index user by api key...
  const userId = await adminPool.maybeOneFirst(sql`
    SELECT
      id
    FROM
      auth.users
    WHERE raw_user_meta_data ->> 'apiKey' = ${apiKey}
  `)
  if (!userId) {
    throw new Error('Invalid api key')
  }
  const adminUrl = new URL(backendEnv.POSTGRES_OR_WEBHOOK_URL)
  const databaseUrl = `${adminUrl.protocol}//usr_${userId}:${apiKey}@${adminUrl.hostname}:${adminUrl.port}${adminUrl.pathname}`

  const client = makePostgresClient({databaseUrl, transformFieldNames: false})

  const clientPool = await client.getPool()
  // @ts-expect-error
  const result = await clientPool.query(client.sql([q]))
  if (format === 'json') {
    res.send(result.rows)
  } else if (format === 'csv') {
    res.send(Papa.unparse([...result.rows]))
  }
})
