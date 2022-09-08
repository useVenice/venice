// Adapted from https://github.com/gjuchault/fuzzyjs
import {compact, sort} from './array-utils'
import {max} from './math-utils'
import {toLatin} from './string-utils'

export interface FuzzyMatchRange {
  start: number
  stop: number
}

export interface FuzzyMatchResult {
  match: boolean
  score: number
  ranges: FuzzyMatchRange[]
}

function normalizeString(str: string) {
  return toLatin(str.replace('/', ' ').toLowerCase())
}

export function fuzzyExactFiltered<T>(
  arr: T[],
  query: string,
  getSource: (item: T) => string | string[],
) {
  return fuzzyFiltered(
    arr.filter((item) => {
      const _source = getSource(item)
      const sources = Array.isArray(_source) ? _source : [_source]
      return sources.some((source) => {
        const normalizedQuery = normalizeString(query)
        const normalizedSource = normalizeString(source)
        return normalizedSource.includes(normalizedQuery)
      })
    }),
    query,
    getSource,
  )
}

export function fuzzyFiltered<T>(
  arr: T[],
  searchQuery: string,
  getSource: (item: T) => string | string[],
) {
  return sort(
    compact(
      arr.map((item) => {
        const _source = getSource(item)
        const sources = Array.isArray(_source) ? _source : [_source]
        const maxScore = max(
          compact(
            sources.map((source) => {
              const res = fuzzyMatch(searchQuery, source)
              return res.match ? res.score : null
            }),
          ),
        )
        return maxScore == null ? null : {...item, score: maxScore}
      }),
    ),
  ).desc((m) => m.score)
}

export function fuzzyMatch(query: string, source: string): FuzzyMatchResult {
  const normalizedQuery = normalizeString(query)
  const normalizedSource = normalizeString(source)

  // If no source, then only return true if query is also empty
  if (!normalizedSource || !normalizedQuery) {
    return {
      match: query.length === 0,
      ranges:
        query.length === 0 ? [{start: 0, stop: normalizedSource.length}] : [],
      score: Number(query.length === 0),
    }
  }

  // A bigger query than source will always return false
  if (normalizedQuery.length > normalizedSource.length) {
    return {match: false, ranges: [], score: 0}
  }

  let queryPos = 0
  let sourcePos = 0
  let score = 0
  let prevCtx: ScoreContext | null = null
  let ranges: FuzzyMatchRange[] = []
  while (sourcePos < source.length) {
    const normalizedSourceChar = normalizedSource[sourcePos]
    const normalizedQueryChar = normalizedQuery[queryPos]
    const match = normalizedSourceChar === normalizedQueryChar

    // Context does not use normalized string as uppercase changes score
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const char = source[sourcePos]!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const prevChar = sourcePos > 0 ? source[sourcePos - 1]! : ''

    const newCtx: ScoreContext = {
      score,
      char,
      prevChar,
      match,
    }
    score = pushScore(prevCtx, newCtx)
    prevCtx = newCtx

    if (match) {
      ranges = pushRange(ranges, sourcePos)
      queryPos += 1
    }

    sourcePos += 1
  }

  if (queryPos !== normalizedQuery.length) {
    return {match: false, ranges: [], score: 0}
  }

  // Bonus for source starting with query
  if (normalizedSource.startsWith(normalizedQuery)) {
    score += 20
  }

  return {match: true, ranges, score}
}

export function fuzzyFilter<T>(query: string, getSource: (val: T) => string) {
  return (val: T) => fuzzyTest(query, getSource(val))
}

export function fuzzyTest(query: string, source: string) {
  const normalizedQuery = normalizeString(query)
  const normalizedSource = normalizeString(source)

  // If no source, then only return true if query is also empty
  if (!normalizedSource) {
    return !query
  }
  if (!normalizedQuery) {
    return true
  }

  // A bigger query than source will always return false
  if (normalizedQuery.length > normalizedSource.length) {
    return false
  }

  let queryPos = 0
  let sourcePos = 0
  while (sourcePos < source.length) {
    const normalizedSourceChar = normalizedSource[sourcePos]
    const normalizedQueryChar = normalizedQuery[queryPos]

    if (normalizedSourceChar === normalizedQueryChar) {
      queryPos += 1
    }

    sourcePos += 1
  }

  return queryPos === normalizedQuery.length
}

// MARK: - Helpers

interface ScoreContext {
  score: number
  prevChar: string
  char: string
  match: boolean
}

/**
 * Based on https://www.forrestthewoods.com/blog/reverse_engineering_sublime_texts_fuzzy_match/
 */
function pushScore(prevCtx: ScoreContext | null, ctx: ScoreContext) {
  if (!ctx.match) {
    // Unmatched letter
    return ctx.score - 1
  }

  let increment = 0
  // Consecutive match bonus
  if (prevCtx?.match) {
    increment += 5
  }
  // Separator bonus
  if (isLeading(ctx.prevChar, ctx.char)) {
    increment += 10
  }

  return ctx.score + increment
}

/**
 * Appends a new match to a list of ranges.
 * Will only increment the last range if the actual match and the last match
 * were siblings
 */
function pushRange(
  ranges: FuzzyMatchRange[],
  sourcePos: number,
): FuzzyMatchRange[] {
  const lastRange = ranges[ranges.length - 1]
  if (lastRange && lastRange.stop === sourcePos) {
    return [
      ...ranges.slice(0, -1),
      {
        start: lastRange.start,
        stop: sourcePos + 1,
      },
    ]
  } else {
    return [...ranges, {start: sourcePos, stop: sourcePos + 1}]
  }
}

/**
 * Returns true when the character is leading, i.e. when it's a capital or
 * when it's following a separator character
 */
function isLeading(prevChar: string, char: string) {
  const precededBySeparator =
    prevChar === '-' ||
    prevChar === '_' ||
    prevChar === ' ' ||
    prevChar === '.' ||
    prevChar === '/' ||
    prevChar === '\\'
  const isCharLeading = UPPERCASE_LETTER_RE.test(char)
  return precededBySeparator || isCharLeading
}

const UPPERCASE_LETTER_RE = /^[A-Z]$/
