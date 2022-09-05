import type {BundleInfo} from './version-utils'
import {getDisplayVersion, getMajorAndMinor} from './version-utils'

test.each<[native: BundleInfo, js: BundleInfo, output: string]>([
  [
    {version: '0.0.1', build: '33'},
    {version: '0.0.2', build: '44'},
    'v0.0.1-2(33-44)',
  ],
  [
    {version: '0.0.1', build: '33'},
    {version: '0.0.2', build: '33'},
    'v0.0.1-2(33)',
  ],
  [
    {version: '0.0.2', build: '33'},
    {version: '0.0.2', build: '36'},
    'v0.0.2(33-36)',
  ],
  [
    {version: '0.10.2', build: '33'},
    {version: '0.13.2', build: '36'},
    'v0.10.2-13.2(33-36)',
  ],
  [
    {version: '0.10.2', build: '33'},
    {version: '1.13.2', build: '36'},
    'v0.10.2-1.13.2(33-36)',
  ],
  // Web apps would have no native version to speak of
  [{version: '', build: ''}, {version: '1.13.2', build: '36'}, 'v1.13.2(36)'],
])('getDisplayVersion(%p, %p) -> %p', (native, js, output) => {
  expect(getDisplayVersion(native, js)).toEqual(output)
})

test.each<[input: string, output: string]>([
  ['0.1.2', '0.1'],
  ['0.1', '0.1'],
  ['1', '1'],
  ['', ''],
  ['0.1.2.5', '0.1'],
])('getMajorAndMinor(%p) -> %p', (input, output) => {
  expect(getMajorAndMinor(input)).toEqual(output)
})
