import {deleteCookie, getCookie, setCookie} from 'cookies-next'
import {atomWithStorage, unstable_NO_STORAGE_VALUE} from 'jotai/utils'
import type {SyncStorage} from 'jotai/utils/atomWithStorage'

export function atomWithCookie<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (val: T) => string
    deserialize?: (
      str: string | null | undefined,
    ) => T | typeof unstable_NO_STORAGE_VALUE
    delayInit?: boolean
  },
) {
  const serialize = options?.serialize ?? JSON.stringify
  const deserialize =
    options?.deserialize ??
    ((str) => {
      try {
        return JSON.parse(str ?? '') as T
      } catch {
        return unstable_NO_STORAGE_VALUE
      }
    })
  const cookieStorage: SyncStorage<T> = {
    getItem: (key) => {
      if (typeof location === 'undefined') {
        return unstable_NO_STORAGE_VALUE
      }
      const storedValue = getCookie(key)
      return typeof storedValue === 'boolean'
        ? (storedValue as T)
        : deserialize(storedValue)
    },
    setItem: (key, newValue) => {
      setCookie(key, serialize(newValue))
    },
    removeItem: (key) => {
      deleteCookie(key)
    },
    ...(options?.delayInit && {delayInit: true}),
  }
  return atomWithStorage(key, initialValue, cookieStorage)
}
