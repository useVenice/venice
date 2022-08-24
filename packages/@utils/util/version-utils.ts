import {compact} from './array-utils'
import {commonPrefix} from './array-utils'

export interface BundleInfo {
  /** User facing display version. Always manually set */
  version: string
  /** Build number. Integer only. Corresponds to github run number, automatically set */
  build: string
}

export function getDisplayVersion(native: BundleInfo, js: BundleInfo) {
  const version = joinVersion(native.version, js.version)
  const build =
    native.build === js.build
      ? native.build
      : compact([native.build, js.build]).join('-')
  return `v${version}(${build})`
}

export function joinVersion(_v1: string, _v2: string) {
  const v1 = _v1.split('.')
  const v2 = _v2.split('.')
  const prefix = commonPrefix(v1, v2)
  const v1Rest = v1.slice(prefix.length)
  const v2Rest = v2.slice(prefix.length)
  return compact([
    prefix.join('.'),
    compact([v1Rest.join('.'), v2Rest.join('.')]).join('-'),
  ]).join('.')
}

/**
 * Turn $major.$minor.$patch -> $major.minor.
 */
export function getMajorAndMinor(version: string) {
  return version.split('.').slice(0, 2).join('.')
}
