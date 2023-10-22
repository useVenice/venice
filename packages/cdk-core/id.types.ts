import {invert, R, z} from '@usevenice/util'

export type ExternalId = z.infer<typeof zExternalId>
export const zExternalId = z.union([z.string(), z.number()])
// .brand<'externalId'>()

/** Provider independent ids */
export const BASE_META_IDS = {
  user: 'user',
  organization: 'org',
  pipeline: 'pipe',
} as const

export const META_IDS = {
  integration: 'int',
  resource: 'reso',
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

export const IDS_INVERTED = invert(IDS)

type BASE_META_ID_PREFIX = (typeof BASE_META_IDS)[keyof typeof BASE_META_IDS]

export type IdPrefix = (typeof IDS)[keyof typeof IDS]
export type Id<TName extends string = string> = {
  [k in IdPrefix]: k extends BASE_META_ID_PREFIX
    ? `${k}_${string}`
    : `${k}_${TName}${string}` // 3rd segment is not guaranteed to exist
}

/** Unfortunately userId is mostly *not* prefixed */
export const zUserId = zId('user')
export type UserId = z.infer<typeof zUserId>

/** trpc-openapi limits us from using .brand https://share.cleanshot.com/Mf4F9xwZ */
export const zEndUserId = z.string().min(1).brand<'end_user'>()
export type EndUserId = z.infer<typeof zEndUserId>

export const zExtEndUserId = z.string().min(1).brand<'ext_end_user'>()
export type ExtEndUserId = z.infer<typeof zExtEndUserId>

export function zId<TPrefix extends IdPrefix>(prefix: TPrefix) {
  return z.string().refine(
    // Add support for doubly-prefixed ids...
    (s): s is Id[TPrefix] => s.startsWith(`${prefix}_`),
    `Is not a valid ${IDS_INVERTED[prefix]} id, expecting ${prefix}_`,
  )
}

export function makeId<TPrefix extends IdPrefix, TPName extends string>(
  ...args: TPrefix extends BASE_META_ID_PREFIX
    ? [TPrefix, ExternalId]
    : [TPrefix, TPName, ExternalId]
) {
  return R.compact(args).join('_') as Id<TPName>[TPrefix]
}

export function extractId(id: Id[keyof Id]) {
  const [prefix, providerName, ...rest] = id.split('_')
  // TODO: Check prefix match predefined prefixes and that providerName is truthy
  // rest.join shall have a type of string which is actually totally the correct type
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [prefix as IdPrefix, providerName!, rest.join('_')] as const
}

// TODO: Should we have a branded type for providerName?
export function extractProviderName(id: Id['int'] | Id['reso']) {
  return extractId(id)[1]
}

export function swapPrefix<TPrefix extends IdPrefix>(
  id: Id[keyof Id],
  newPrefix: TPrefix,
) {
  const [, providerName, rest] = extractId(id)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  return makeId<TPrefix, string>(...([newPrefix, providerName, rest] as any))
}
