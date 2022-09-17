import type {Options as SlugifyOptions} from '@sindresorhus/slugify'
import _slugify from '@sindresorhus/slugify'
import {startCase} from 'lodash'

export function slugify(str: string, opts?: SlugifyOptions): string
export function slugify(
  str: string | null | undefined,
  opts?: SlugifyOptions,
): string | null
export function slugify(str: string | null | undefined, opts?: SlugifyOptions) {
  if (str == null) {
    return str ?? null
  }
  // HACK: Preserve underscores
  return str
    .split('_')
    .map((substr) => _slugify(substr, opts))
    .join('_')
}

/**
 * Returns a normalized version of the string
 * Based on https://stackoverflow.com/a/37511463
 */
export function toLatin(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}

export function formatCount(count: number, inflections: [string, string?]) {
  return `${count} ${
    count === 1 ? inflections[0] : inflections[1] ?? `${inflections[0]}s`
  }`
}

export function makeUniqueLabel(
  label: string,
  hasConflict: (suffixedLabel: string) => boolean,
  opts?: {separator?: string},
) {
  for (const suffixedLabel of iterateSuffixedLabels(label, opts)) {
    if (!hasConflict(suffixedLabel)) {
      return suffixedLabel
    }
  }
  throw new Error('Illegal state: Expected to return from loop')
}

export function* iterateSuffixedLabels(
  label: string,
  {separator = ' '}: {separator?: string} = {},
) {
  let suffixedLabel = label
  let suffix = 1
  while (true) {
    yield suffixedLabel
    suffix++
    suffixedLabel = `${label}${separator}${suffix}`
  }
}

export function formatList(list: string[]) {
  if (list.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return list[0]!
  }
  if (list.length === 2) {
    return list.join(' and ')
  }
  return `${list[0]} and ${list.length - 1} others`
}

/** Adapted from https://github.com/esamattis/underscore.string/blob/master/titleize.js */
export function titleCase(str: string | undefined) {
  return startCase(str)
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase())
}

export {
  camelCase,
  escapeRegExp,
  lowerCase,
  lowerFirst as lowerCaseFirst,
  padEnd as rightPad,
  padStart as leftPad,
  snakeCase,
  // there is no titleCase so startCase will have to do
  startCase,
  truncate,
  upperCase,
  upperFirst as upperCaseFirst,
  kebabCase,
} from 'lodash'
export {default as md5Hash} from 'md5-hex'
export {parseFullName} from 'parse-full-name'
export {default as pluralize} from 'pluralize'
export {default as sdbmHash} from 'sdbm'
export {sentenceCase} from 'sentence-case'
