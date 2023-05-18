import {TRPCError} from '@trpc/server'
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

import {
  contextFactory,
  DatabaseError,
  Papa,
} from '@usevenice/app-config/backendConfig'
import {kAcceptUrlParam} from '@usevenice/app-config/constants'
import type {Id} from '@usevenice/cdk-core'
import {hasRole} from '@usevenice/cdk-core'
import {
  makePostgresClient,
  zPgConfig,
} from '@usevenice/core-integration-postgres'
import {z} from '@usevenice/util'

import {serverComponentGetViewer} from '@/server/server-component-helpers'
import {trpcErrorResponse} from '@/server/server-helpers'

export async function GET(
  request: NextRequest,
  {params: {resourceId}}: {params: {resourceId: string}},
) {
  try {
    const {
      q: query,
      [kAcceptUrlParam]: acceptedFormat,
      dl: download,
    } = Object.fromEntries(request.nextUrl.searchParams.entries())

    if (!query) {
      return new NextResponse('sql query param q is required', {status: 400})
    }
    const format = z.enum(['csv', 'json']).default('json').parse(acceptedFormat)

    const viewer = await serverComponentGetViewer(request.nextUrl)
    if (!hasRole(viewer, ['user', 'org', 'system'])) {
      throw new TRPCError({
        code: viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
      })
    }

    const {helpers} = contextFactory.fromViewer(viewer)
    const reso = await helpers.getResourceOrFail(resourceId as Id['reso'])

    if (reso.providerName !== 'postgres') {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Only postgres resources are supported',
      })
    }

    const {getPool, sql} = makePostgresClient(zPgConfig.parse(reso.settings))
    const pool = await getPool()

    console.log('[sql] Will run query for user', {query, viewer})

    // TODO: Should we limit admin user to RLS also? Otherwise we might as well
    // proxy the pgMeta endpoint just like we proxy rest / graphql
    // @ts-expect-error
    const result = await pool.query(sql([query]))

    const res =
      format === 'csv'
        ? new NextResponse(Papa.unparse([...result.rows]), {
            headers: {'Content-Type': 'text/csv'},
          })
        : NextResponse.json(result.rows)

    if (download) {
      // TODO: Better filename would be nice.
      res.headers.set(
        'Content-Disposition',
        `attachment; filename="venice-${Date.now()}.${format}"`,
      )
    }
    return res
  } catch (err) {
    // DatabaseError is most likely a result of invalid sql syntax
    if (err instanceof DatabaseError) {
      return new NextResponse(err.message, {status: 400})
    }
    if (err instanceof TRPCError) {
      return trpcErrorResponse(err)
    }
    throw err
  }
}
