import {setCookie} from 'cookies-next'
import {atom} from 'jotai'
import {RESET} from 'jotai/utils'
import type {QueryParamConfig} from 'use-query-params'

import {atomWithCookie} from './atomWithCookie'
import {atomWithQueryParam, getSearchParams} from './atomWithQueryParam'

export function atomWithPersistedQueryParam<T>(
  key: string,
  initialValue: T,
  queryParamConfig: QueryParamConfig<
    T | null | undefined,
    T | null | undefined
  >,
) {
  const paramAtom = atomWithQueryParam(key, initialValue, queryParamConfig)
  const cookieAtom = atomWithCookie(key, initialValue)
  return atom(
    (get) => {
      if (typeof window !== 'undefined' && getSearchParams().has(key)) {
        const paramValue = get(paramAtom)
        setCookie(key, JSON.stringify(paramValue))
        return paramValue
      } else {
        const cookieValue = get(cookieAtom)
        return cookieValue
      }
    },
    (get, set, update) => {
      const nextValue =
        typeof update === 'function'
          ? (update(get(paramAtom)) as T)
          : (update as T)
      set(paramAtom, RESET)
      set(cookieAtom, nextValue)
    },
  )
}
