import * as R from 'remeda'
import type {ParsedUrl, ParseOptions} from 'query-string'
import {
  parse as _parseQueryParams,
  parseUrl as _parseUrl,
  stringify as _stringifyQueryParams,
} from 'query-string'

import type {AnyRecord} from './type-utils'

export {stringify as stringifyQueryParams} from 'query-string'

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

export function joinPath(p1: string, p2: string) {
  return p1.replace(/\/$/, '') + '/' + p2.replace(/^\//, '')
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
