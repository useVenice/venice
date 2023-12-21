import '@usevenice/app-config/register.node'
import type {NextApiHandler} from 'next'
import {createOpenApiNextHandler} from '@usevenice/trpc-openapi'
import {respondToCORS} from '@/lib-server'
import {appRouter} from '@/lib-server/appRouter'
import {createContext, onError} from '../trpc/[...trpc]'

const handler = createOpenApiNextHandler({
  // not sure why this cast is needed...
  router: appRouter as any,
  createContext,
  onError,
})

export default (function trpcOpenAPIHandler(req, res) {
  if (respondToCORS(req, res)) {
    return
  }
  if (req.headers['transfer-encoding'] === 'chunked') {
    res.status(400).send('Chunked transfer encoding is not supported')
    return
  }
  console.log(
    '[trpcOpenAPIHandler]',
    req.url,
    req.method,
    // req.headers,
    // req.body,
  )

  return handler(req, res)
} satisfies NextApiHandler)
