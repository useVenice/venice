import {joinPath} from './url-utils'
// import path from 'node:path'

test.each([
  ['http://example.com/', '/hello', 'http://example.com/hello'],
  ['http://example.com', '/hello', 'http://example.com/hello'],
  ['http://example.com', 'hello', 'http://example.com/hello'],
  ['http://example.com', 'hello/', 'http://example.com/hello/'],
  ['graphql/v1', '', 'graphql/v1'],
  ['rest/v1/', '', 'rest/v1/'],
  ['rest/v1/', '/', 'rest/v1/'],
  ['rest/v1/', '//', 'rest/v1/'],
  ['rest/v1/', '///', 'rest/v1/'],
  ['/rest/v1/', '', '/rest/v1/'],
])('joinPath(%o, %o) -> %o', (p1, p2, output) => {
  // os.path.join does not handle :// , so this is actually not the same
  // expect(path.join(p1, p2)).toEqual(output)
  expect(joinPath(p1, p2)).toEqual(output)
})
