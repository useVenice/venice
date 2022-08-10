import {
  parse as _parseQueryParams,
  parseUrl as _parseUrl,
  stringify as _stringifyQueryParams,
  ParsedUrl,
  ParseOptions,
  StringifyOptions,
} from 'query-string'

export function appendPathComponent(href: string, pathComponent: string) {
  const url = new URL(href)
  url.pathname = joinPath(url.pathname, pathComponent)
  return url.toString()
}

type UnknownRecord = Record<string, unknown>

export const parseUrl = <T extends UnknownRecord>(
  url: string,
  opts?: ParseOptions,
) => _parseUrl(url, opts) as Omit<ParsedUrl, 'query'> & {readonly query: T}

export function parseQueryParams<T extends UnknownRecord>(
  query: string,
  options?: ParseOptions,
) {
  return _parseQueryParams(query, options) as T
}

export function patchQueryParams(
  href: string,
  patch: UnknownRecord,
  options?: StringifyOptions,
) {
  const url = new URL(href)
  url.search = queryParamsToSearch(
    {
      ...parseQueryParams(url.search),
      ...patch,
    },
    options,
  )
  return url.toString()
}

export function pruneQueryParams(params: UnknownRecord): UnknownRecord {
  const res: UnknownRecord = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      continue
    }

    res[key] = value
  }
  return res
}

export function queryParamsToSearch(
  params: UnknownRecord | undefined,
  options?: StringifyOptions,
) {
  const prunedQueryParams = params ? pruneQueryParams(params) : {}
  if (Object.keys(prunedQueryParams).length === 0) {
    return ''
  }
  return `?${_stringifyQueryParams(prunedQueryParams, options)}`
}

export function joinPath(p1: string, p2: string) {
  return p1.replace(/\/$/, '') + '/' + p2.replace(/^\//, '')
}

export {default as base64url} from 'base64url'
export {stringify as stringifyQueryParams} from 'query-string'
