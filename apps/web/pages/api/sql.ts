import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {DatabaseError, Papa} from '@usevenice/app-config/backendConfig'
import {kAcceptUrlParam} from '@usevenice/app-config/constants'
import {z} from '@usevenice/util'
import {runAsAdmin, sql} from '../../server'
import {respondToCORS, serverGetApiUserId} from '../../server/api-helpers'

export default (async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }
  const [userId, {isAdmin}] = await serverGetApiUserId({req, res})
  if (!userId) {
    res.status(401).send('Unauthorized')
    return
  }
  if (!isAdmin) {
    res.status(403).send('Forbidden')
    return
  }

  const {q: query, [kAcceptUrlParam]: acceptedFormat, dl: download} = req.query
  if (!query) {
    res.status(400).send('sql query param q is required')
    return
  }

  const format = z.enum(['csv', 'json']).default('json').parse(acceptedFormat)

  console.log('[sql] Will run query for user', {query, userId})
  try {
    // TODO: Should we limit admin user to RLS also? Otherwise we might as well
    // proxy the pgMeta endpoint just like we proxy rest / graphql
    const result = await runAsAdmin((trxn) =>
      // @ts-expect-error
      trxn.query(sql([query])),
    )

    if (download) {
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
    // DatabaseError is most likely a result of invalid sql syntax
    if (err instanceof DatabaseError) {
      res.status(400).send(err.message)
      return
    }
    throw err
  }
}) satisfies NextApiHandler
