import {appendPathComponent, joinPath} from './url-utils'

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

test('appendPathComponent', () => {
  expect(
    appendPathComponent('https://rly.to/exe.com/?_token=123', 'sandbox'),
  ).toBe('https://rly.to/exe.com/sandbox?_token=123')

  expect(
    appendPathComponent('https://rly.to/exe.com/?_token=123', '/sandbox'),
  ).toBe('https://rly.to/exe.com/sandbox?_token=123')

  expect(
    appendPathComponent('https://rly.to/exe.com/?_token=123', '/sandbox/'),
  ).toBe('https://rly.to/exe.com/sandbox/?_token=123')

  expect(
    appendPathComponent('https://rly.to/exe.com/?_token=123#abc', '/sandbox/'),
  ).toBe('https://rly.to/exe.com/sandbox/?_token=123#abc')

  expect(appendPathComponent('https://rly.to/', 'dev')).toBe(
    'https://rly.to/dev',
  )
})
