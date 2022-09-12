import {atomWithStorage, unstable_NO_STORAGE_VALUE} from 'jotai/utils'
import type {SyncStorage} from 'jotai/utils/atomWithStorage'
import Router from 'next/router'
import type {QueryParamConfig} from 'use-query-params'

export function atomWithQueryParam<T>(
  key: string,
  initialValue: T,
  queryParamConfig: QueryParamConfig<
    T | null | undefined,
    T | null | undefined
  >,
  options?: {
    delayInit?: boolean
    replaceState?: boolean
    subscribe?: (callback: () => void) => () => void
  },
) {
  function serialize(val: T) {
    return queryParamConfig.encode(val) as string
  }
  function deserialize(str: string | null) {
    try {
      return queryParamConfig.decode(str) ?? unstable_NO_STORAGE_VALUE
    } catch {
      return unstable_NO_STORAGE_VALUE
    }
  }
  const routeFn = options?.replaceState ? Router.replace : Router.push
  function setSearch(search: string) {
    void routeFn(
      {
        pathname: Router.pathname,
        search,
      },
      {
        pathname: Router.asPath.match(PATHNAME_RE)?.[0] ?? Router.asPath,
        search,
      },
      {shallow: true, scroll: false},
    )
  }
  const queryParamStorage: SyncStorage<T> = {
    getItem: (key) => {
      if (typeof window === 'undefined') {
        return unstable_NO_STORAGE_VALUE
      }
      const searchParams = getSearchParams()
      const storedValue = searchParams.get(key)
      return deserialize(storedValue)
    },
    setItem: (key, newValue) => {
      const searchParams = getSearchParams()
      searchParams.set(key, serialize(newValue))
      setSearch(searchParams.toString())
    },
    removeItem: (key) => {
      const searchParams = getSearchParams()
      searchParams.delete(key)
      setSearch(searchParams.toString())
    },
    ...(options?.delayInit && {delayInit: true}),
    subscribe: (key, setValue) => {
      const callback = () => {
        const searchParams = getSearchParams()
        const str = searchParams.get(key)
        setValue(str === null ? initialValue : (deserialize(str) as T))
      }
      Router.events.on('routeChangeComplete', callback)
      window.addEventListener('hashchange', callback)
      return () => {
        Router.events.off('routeChangeComplete', callback)
        window.removeEventListener('hashchange', callback)
      }
    },
  }
  return atomWithStorage(key, initialValue, queryParamStorage)
}

export function getSearchParams() {
  return new URLSearchParams(getLocation().search)
}

export function getLocation() {
  return window.location
}

// export function getLocation() {
//   if (typeof window !== 'undefined') {
//     // For SSG, no query parameters are available on the server side,
//     // since they can't be known at build time. Therefore to avoid
//     // markup mismatches, we need a two-part render in this case that
//     // patches the client with the updated query parameters lazily.
//     // Note that for SSR `router.isReady` will be `true` immediately
//     // and therefore there's no two-part render in this case.
//     if (Router.isReady) {
//       return window.location
//     } else {
//       return {search: ''} as Location
//     }
//   } else {
//     // On the server side we only need a subset of the available
//     // properties of `Location`. The other ones are only necessary
//     // for interactive features on the client.
//     return {search: Router.asPath.replace(PATHNAME_RE, '')} as Location
//   }
// }

const PATHNAME_RE = /[^?#]+/u
