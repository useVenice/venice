import {z} from '@ledger-sync/util'

/** Provider independent ids */
export const BASE_META_IDS = {
  ledger: 'ldgr', // Technicall we do not store this...
  pipeline: 'pipe',
} as const

export const META_IDS = {
  integration: 'int',
  connection: 'conn',
  institution: 'ins',
} as const

export const DATA_IDS = {
  account: 'acct',
  transaction: 'txn',
  commodity: 'comm',
  balance: 'bal',
  price: 'prce',
} as const

export const IDS = {
  ...BASE_META_IDS,
  ...META_IDS,
  ...DATA_IDS,
}

type BASE_META_ID_PREFIX = typeof BASE_META_IDS[keyof typeof BASE_META_IDS]

export type IdPrefix = typeof IDS[keyof typeof IDS]
export type Id<TName extends string = string> = {
  [k in IdPrefix]: k extends BASE_META_ID_PREFIX
    ? `${k}_${string}`
    : `${k}_${TName}_${string}`
}

export function zId<TPrefix extends IdPrefix>(prefix: TPrefix) {
  return z.string().refine(
    // Add support for doubly-prefixed ids...
    (s): s is Id[TPrefix] => s.startsWith(`${prefix}_`),
    `Not a valid ${prefix} id`,
  )
}

export function makeId<TPrefix extends IdPrefix, TPName extends string>(
  ...args: TPrefix extends BASE_META_ID_PREFIX
    ? [TPrefix, string]
    : [TPrefix, TPName, string]
) {
  return args.join('_') as Id<TPName>[TPrefix]
}

export function extractId(id: Id[keyof Id]) {
  const [prefix, providerName, ...rest] = id.split('_')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [prefix as IdPrefix, providerName!, rest.join('_')] as const
}

// Types
// Input type (generic)
// - DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic)

// MARK: - Deprecated stuff

/** @deprecated, use `Id` */
export type ConnId<TName extends string = string> = `conn_${TName}_${string}`
/** @deprecated, use `Id` */
export type IntId<TName extends string = string> = `int_${TName}_${string}`
/** @deprecated, use `Id` */
export type InsId<TName extends string = string> = `ins_${TName}_${string}`
/** @deprecated, use `Id` */
export type PipeId = `pipe_${string}`
