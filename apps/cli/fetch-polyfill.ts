import fetch, {Headers, Request, Response} from 'node-fetch'

// TODO: Try to not using node-fetch or use another version because of this issue https://github.com/nock/nock/issues/2197

if (!globalThis.fetch) {
  globalThis.fetch = fetch as any
  globalThis.Headers = Headers as any
  globalThis.Request = Request as any
  globalThis.Response = Response as any
}
