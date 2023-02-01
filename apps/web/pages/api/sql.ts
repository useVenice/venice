import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {Papa} from '@usevenice/app-config/backendConfig'
import {R, z} from '@usevenice/util'
import {runAsAdmin, runAsUser, sql} from '../../server'
import {respondToCORS} from '../../server/api-helpers'

export default R.identity<NextApiHandler>(async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }
  const {q: query, apiKey} = req.query
  if (!query) {
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

  // TODO: index user by api key...
  const userId = await runAsAdmin((pool) =>
    pool.maybeOneFirst<string>(sql`
      SELECT
        id
      FROM
        auth.users
      WHERE raw_user_meta_data ->> 'apiKey' = ${apiKey}
    `),
  )
  if (!userId) {
    throw new Error('Invalid api key')
  }

  const result = await runAsUser(userId, async (trxn) =>
    // @ts-expect-error
    trxn.query(sql([query])),
  )

  // const clientPool = await client.getPool()

  // const result = await clientPool.query(client.sql([q]))
  if (req.query['dl']) {
    // TODO: Better filename would be nice.
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sql-${Date.now()}.${format}"`,
    )
  }
  if (format === 'json') {
    res.send(result.rows)
  } else if (format === 'csv') {
    res.send(Papa.unparse([...result.rows]))
  }
})
