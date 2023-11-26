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

export default (function trpcHandler(req, res) {
  if (respondToCORS(req, res)) {
    return
  }
  // allow the root document to work.
  if (!req.query['trpc']) {
    req.query['trpc'] = ''
  }
  return handler(req, res)
} satisfies NextApiHandler)
