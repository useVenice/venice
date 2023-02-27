import * as R from 'remeda'
import type {ParsedUrl, ParseOptions} from 'query-string'
import {
  parse as _parseQueryParams,
  parseUrl as _parseUrl,
  stringify as _stringifyQueryParams,
} from 'query-string'

import type {AnyRecord} from './type-utils'

export {stringify as stringifyQueryParams, stringifyUrl} from 'query-string'

export function parseUrl<T extends AnyRecord>(
  url: string,
  opts?: ParseOptions,
) {
  return _parseUrl(url, opts) as Omit<ParsedUrl, 'query'> & {readonly query: T}
}

export function parseQueryParams<T extends AnyRecord>(
  query: string,
  options?: ParseOptions,
) {
  return _parseQueryParams(query, options) as T
}

/** Via https://stackoverflow.com/a/55142565/692499, How do we get identical behavior as require('node:path').join */
export function joinPath(...optionalParts: Array<string | null | undefined>) {
  const parts = optionalParts.filter((p): p is string => !!p)
  const leading = parts[0]?.startsWith('/') ? '/' : ''
  const trailing = parts[parts.length - 1]?.endsWith('/') ? '/' : ''
  return `${leading}${parts
    .map((p) => p.replace(/\/+$/, '').replace(/^\/+/, ''))
    .filter((p) => !!p) // Removes duplicate `//`
    .join('/')}${trailing}`
}

export function buildUrl(input: {
  path: string
  params?: Record<string, unknown>
}) {
  return R.compact([
    input.path,
    input.params && _stringifyQueryParams(input.params),
  ]).join('?')
}
