import {startCase, camelCase as _camelCase} from 'lodash'
import type {CamelCase} from 'type-fest'

export {
  padStart as leftPad,
  snakeCase,
  startCase,
  upperFirst as upperCaseFirst,
} from 'lodash'
export {default as md5Hash} from 'md5-hex'
export {default as pluralize} from 'pluralize'
export {sentenceCase} from 'sentence-case'

/** Adapted from https://github.com/esamattis/underscore.string/blob/master/titleize.js */
export function titleCase(str: string | undefined) {
  return startCase(str)
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase())
}

export function camelCase<T extends string>(str: T) {
  return _camelCase(str) as CamelCase<T>
}
