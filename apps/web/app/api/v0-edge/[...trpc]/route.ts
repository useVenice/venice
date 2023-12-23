import {modifyRequest, modifyResponse} from '@opensdks/fetch-links'

export const runtime = 'edge'

// Used to workaround issues where next.js node handler does not support incoming request with
// transfer-encoding: chunked
const handler = async (req: Request) => {
  const body = await req.text()
  console.log('[trpcOpenAPIHandler]', req.url, req.method, body)
  const res = await fetch(
    modifyRequest(req, {
      url: req.url.replace('/api/v0-edge', '/api/v0'),
      headers: (h) => h.delete('transfer-encoding'),
      body,
    }),
  )
  // console.log('[trpcOpenAPIHandler]', req.url, req.method, res.status)

  // otherwise crash if header exists...
  return modifyResponse(res, {headers: (h) => h.delete('x-middleware-rewrite')})
}

export {
  handler as GET,
  handler as PUT,
  handler as POST,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
  handler as PATCH,
  handler as TRACE,
}
