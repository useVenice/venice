import getPort from 'get-port'
import {NextRequest, NextResponse} from 'next/server'
import postgrest from 'postgrest'

let server: Awaited<ReturnType<typeof startServer>>

async function startServer() {
  console.log('starting server...')
  const port = await getPort()
  const server = await postgrest.startServer({
    dbUri: process.env._DEBUG_DB_URL,
    dbAnonRole: 'venice', // Mabe make this anon?
    dbSchema: 'venice',
    serverPort: port,
    dbPool: 2,
  })
  const url = `http://localhost:${port}`
  return {server, url}
}

async function startOrResetServer() {
  console.log('startOrResetServer', Boolean(server))
  if (!server) {
    console.log('server not yet initialized, initializing...')
    server = await startServer()
    console.log(server.url)
  } else {
    try {
      const res = await fetch(server.url)
      console.log('res', res)
      if (!(res.status >= 200 && res.status < 300)) {
        console.log("Couldn't connect to previous postgrest instance")
        throw new Error("Couldn't connect to previous postgrest instance")
      }
    } catch (e) {
      console.log(`${e}`)
      console.log('Restarting postgrest...')
      await server.server.stop()
      await startServer()
    }
  }
}

async function proxy(req: NextRequest) {
  await startOrResetServer()
  const reqUrl = new URL(req.url)

  const proxyTo = `${server.url}${req.url.replace(/.*\/postgrest/, '')}`
  console.log('proxying to', proxyTo)

  const res = await fetch(proxyTo, {
    method: req.method,
    headers: Object.assign(
      {'x-forwarded-host': req.headers.get('host')},
      req.headers,
      {host: reqUrl.host},
    ),
    body: req.body,
    redirect: 'manual',
  })

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  })
}

export {proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE}
