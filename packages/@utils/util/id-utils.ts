import {decodeTime, ulid} from 'ulidx'

export function makeUlid() {
  return ulid()
}
makeUlid.decodeTime = decodeTime

// TODO: Add converter to / from uuid.
// As ulid is 128-bit compatible with uuid
// https://github.com/ulid/spec#universally-unique-lexicographically-sortable-identifier

/**
 * Alphabet from. Alphanumeric removing lookalikes
 * https://github.com/CyberAP/nanoid-dictionary/blob/master/nolookalikes.js
 * Numbers and english alphabet without lookalikes: 1, l, I, 0, O, o, u, v
 */
export const ALPHANUMERIC_SAN_LOOKALIKES =
  '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstwxyz'

// MARK: - Deprecated stuff, remove me....

/** @deprecated */
export function makePrefixedId<P extends string, T extends string>(
  prefix: P,
  providerName: T, // Remove dependency on this.
  externalId: string | null | undefined,
) {
  return `${prefix}_${providerName}_${externalId ?? makeUlid()}` as const
}

/** @deprecated */
export function splitPrefixedId(id: string) {
  const [prefix, providerName, ...rest] = id.split('_')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [prefix!, providerName!, rest.join('_')] as const
}

/** @deprecated */
export function temp_makeId<P extends string>(
  prefix: P,
  externalId: string | null | undefined,
) {
  return `${prefix}_${externalId ?? makeUlid()}` as const
}
