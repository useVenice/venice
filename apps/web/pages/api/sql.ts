import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {Papa, DatabaseError} from '@usevenice/app-config/backendConfig'
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
    res.status(401).send('Invalid api key')
    return
  }
  console.log('[sql] Will run query for user', {query, userId})
  try {
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
        `attachment; filename="venice-${Date.now()}.${format}"`,
      )
    }

    switch (format) {
      case 'json':
        res.json(result.rows)
        break
      case 'csv':
        res.setHeader('Content-Type', 'text/csv')
        // TODO: This currently doesn't work with JSONB columns being exported (needs to be stringified)
        res.send(Papa.unparse([...result.rows]))
        break
    }
  } catch (err) {
    if (err instanceof DatabaseError) {
      res.status(400).send(err.message)
      return
    }
    throw err
  }
})
