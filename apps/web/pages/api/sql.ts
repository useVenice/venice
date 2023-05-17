import '@usevenice/app-config/register.node'

import {TRPCError} from '@trpc/server'
import type {NextApiHandler} from 'next'

import {
  contextFactory,
  DatabaseError,
  Papa,
} from '@usevenice/app-config/backendConfig'
import {kAcceptUrlParam} from '@usevenice/app-config/constants'
import type {Id} from '@usevenice/cdk-core'
import {hasRole} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

import {
  makePostgresClient,
  zPgConfig,
} from '@/../../integrations/core-integration-postgres'

import {respondToCORS, serverGetViewer} from '../../server/server-helpers'

export default (async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }

  const {
    q: query,
    [kAcceptUrlParam]: acceptedFormat,
    dl: download,
    resourceId,
  } = req.query
  if (!query) {
    res.status(400).send('sql query param q is required')
    return
  }
  const format = z.enum(['csv', 'json']).default('json').parse(acceptedFormat)

  if (typeof resourceId !== 'string') {
    res.status(400).send('resourceId is required')
    return
  }

  const viewer = await serverGetViewer({req, res})

  if (!hasRole(viewer, ['user', 'org', 'system'])) {
    throw new TRPCError({
      code: viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }

  const {helpers} = contextFactory.fromViewer(viewer)
  const reso = await helpers.getResourceOrFail(resourceId as Id['reso'])
  console.log('reso', reso)

  const {getPool, sql} = makePostgresClient(zPgConfig.parse(reso.settings))
  const pool = await getPool()

  console.log('[sql] Will run query for user', {query, viewer})
  try {
    // TODO: Should we limit admin user to RLS also? Otherwise we might as well
    // proxy the pgMeta endpoint just like we proxy rest / graphql
    // @ts-expect-error
    const result = await pool.query(sql([query]))

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
