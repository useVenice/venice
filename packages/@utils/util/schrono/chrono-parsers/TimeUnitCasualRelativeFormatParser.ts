// Adapted from https://github.com/wanasit/chrono/blob/v2.3.0/src/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser.ts
import {ParsingContext} from 'chrono-node/dist/chrono'
import {parseTimeUnits} from 'chrono-node/dist/locales/en/constants'
import _BaseTimeUnitCasualRelativeFormatParser from 'chrono-node/dist/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser'
import {ParsingResult} from 'chrono-node/dist/results'
import {reverseTimeUnits, TimeUnits} from 'chrono-node/dist/utils/timeunits'
import {
  checkWordBoundary,
  makeRelativeParsingComponents,
} from './chrono-parser-utils'

// Parser for expressions like "next 2 weeks", "last 3 months", "past 4 years"
export class TimeUnitCasualRelativeFormatParser extends _BaseTimeUnitCasualRelativeFormatParser {
  override extract(
    ctx: ParsingContext,
    match: RegExpMatchArray,
  ): ParsingResult {
    checkWordBoundary(match)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const prefix = match[1]!.toLowerCase()
    let fragments = parseTimeUnits(match[2]) as TimeUnits

    switch (prefix) {
      case 'last':
      case 'past':
      case '-':
        fragments = reverseTimeUnits(fragments)
        break
    }

    return makeRelativeParsingComponents(ctx, match, fragments)
  }
}

export {default as BaseTimeUnitCasualRelativeFormatParser} from 'chrono-node/dist/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser'
