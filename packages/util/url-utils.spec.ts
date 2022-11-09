import {joinPath} from './url-utils'

test('joinPath', () => {
  expect(joinPath('http://example.com/', '/hello')).toBe(
    'http://example.com/hello',
  )
  expect(joinPath('http://example.com', '/hello')).toBe(
    'http://example.com/hello',
  )
  expect(joinPath('http://example.com', 'hello')).toBe(
    'http://example.com/hello',
  )
  expect(joinPath('http://example.com', 'hello/')).toBe(
    'http://example.com/hello/',
  )
})
