import {modifyRequest, modifyResponse} from '@opensdks/fetch-links'

// Used to workaround issues where next.js node handler does not support incoming request with
// transfer-encoding: chunked
const handler = async (req: Request) => {
  const res = await fetch(
    modifyRequest(req, {
      url: req.url.replace('/api/v0-edge', '/api/v0'),
      headers: (h) => h.delete('transfer-encoding'),
      // @ts-expect-error https://github.com/nodejs/node/issues/46221
      duplex: 'half',
    }),
  )
  // console.log('[trpcOpenAPIHandler]', req.url, req.method, res.status)

  // otherwise crash if header exists...
  return modifyResponse(res, {headers: (h) => h.delete('x-middleware-rewrite')})
}

export {handler as GET, handler as POST, handler as PUT, handler as DELETE}
