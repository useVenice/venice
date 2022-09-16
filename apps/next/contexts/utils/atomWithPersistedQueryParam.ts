import {setCookie} from 'cookies-next'
import {atom} from 'jotai'
import {RESET} from 'jotai/utils'
import type {QueryParamConfig} from 'use-query-params'

import {atomWithCookie} from './atomWithCookie'
import {atomWithQueryParam, getSearchParams} from './atomWithQueryParam'

/** Persist query param into cookie */
export function buggy__atomWithPersistedQueryParam<T>(
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
        // BUG ALERT: This does not invoke write function of the cookie atom
        // and therefore will be out of sync until page refresh.
        // Couldn't figure out an easy way to fix it.

        // Also cookieStorage change API is not universal yet (type not available in ts core)
        // Also cookies are prone to be out of date across tabs...
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
