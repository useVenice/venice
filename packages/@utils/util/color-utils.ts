import _chroma from 'chroma-js'
import {catchAsNull} from './function-utils'
import {sdbmHash} from './string-utils'

/** Courtesy of Notion.app */
export const PastelColors = {
  Default: '#E6E6E4',
  Gray: '#D7D7D5',
  Brown: '#E6D7D0',
  Orange: '#F9E1D5',
  Yellow: '#F9EED8',
  Green: '#D8E7E2',
  Blue: '#D6E4F7',
  Purple: '#DFD4F7',
  Pink: '#F4D5E5',
  Red: '#FBD6D5',
}

export function defaultLabelColor(name: string) {
  const colorNames = Object.keys(PastelColors) as Array<
    keyof typeof PastelColors
  >
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const colorName = colorNames[sdbmHash(name) % colorNames.length]!
  return PastelColors[colorName]
}

/** https://stackoverflow.com/a/6672684 */
export function transparentizeOverWhite(rawColor: string) {
  const color = _chroma(rawColor).rgb()
  const [r, g, b] = color
  const a = Math.min(r, Math.min(g, b)) / 255
  return _chroma
    .rgb(255 + (r - 255) / a, 255 + (g - 255) / a, 255 + (b - 255) / a)
    .alpha(a)
    .toString()
}

export function safeChroma(
  color: string | number | _chroma.Color | null | undefined,
): _chroma.Color | null
export function safeChroma(
  a: number,
  b: number,
  c: number,
  colorSpace?: keyof _chroma.ColorSpaces,
): _chroma.Color | null
export function safeChroma(
  a: number,
  b: number,
  c: number,
  d: number,
  colorSpace?: keyof _chroma.ColorSpaces,
): _chroma.Color | null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeChroma(...args: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return catchAsNull(() => (args[0] == null ? null : (_chroma as any)(...args)))
}

export {default as chroma} from 'chroma-js'
