// TODO: Maybe this belongs in engine backend?
import {invert, memoize, R} from '@usevenice/util'
import {extendZodWithOpenApi, z} from '@usevenice/zod'

export type ExternalId = z.infer<typeof zExternalId>
export const zExternalId = z.union([z.string(), z.number()])
// .brand<'externalId'>()

/** Provider independent ids */
export const INDEPENDENT_IDS = {
  user: 'user',
  organization: 'org',
  pipeline: 'pipe',
} as const

export const PROVIDER_IDS = {
  integration: 'int',
  resource: 'reso',
  institution: 'ins',
} as const

export const IDS = {
  ...INDEPENDENT_IDS,
  ...PROVIDER_IDS,
}

export const IDS_INVERTED = invert(IDS)

type INDEPENDENT_ID_PREFIX =
  (typeof INDEPENDENT_IDS)[keyof typeof INDEPENDENT_IDS]

export type IdPrefix = (typeof IDS)[keyof typeof IDS]
export type Id<TName extends string = string> = {
  [k in IdPrefix]: k extends INDEPENDENT_ID_PREFIX
    ? `${k}_${string}`
    : `${k}_${TName}${string}` // 3rd segment is not guaranteed to exist
}

/**
 * This needs to be memoized because duplicate calls to .openapi with
 * the same ref is an error
 */
function _zId<TPrefix extends IdPrefix>(prefix: TPrefix) {
  // Not sure why this is needed...
  // but if not including it we get a crash...
  extendZodWithOpenApi(z)
  return z
    .string()
    .refine(
      // Add support for doubly-prefixed ids...
      (s): s is Id[TPrefix] => s.startsWith(`${prefix}_`),
      `Is not a valid ${IDS_INVERTED[prefix]} id, expecting ${prefix}_`,
    )
    .openapi({ref: `id.${prefix}`, description: `Must start with '${prefix}_'`})
}

export const zId = memoize(_zId, {
  // Should make it easier like -1 to never clear cache...
  maxSize: Number.POSITIVE_INFINITY, // Forever and always ;)
})

/** Unfortunately userId is mostly *not* prefixed */
export const zUserId = zId('user')
export type UserId = z.infer<typeof zUserId>

/** trpc-openapi limits us from using .brand https://share.cleanshot.com/Mf4F9xwZ */
export const zEndUserId = z.string().min(1).brand<'end_user'>()
export type EndUserId = z.infer<typeof zEndUserId>

export const zExtEndUserId = z.string().min(1).brand<'ext_end_user'>()
export type ExtEndUserId = z.infer<typeof zExtEndUserId>

export function makeId<TPrefix extends IdPrefix, TPName extends string>(
  ...args: TPrefix extends INDEPENDENT_ID_PREFIX
    ? [TPrefix, ExternalId]
    : [TPrefix, TPName, ExternalId]
) {
  return R.compact(args).join('_') as Id<TPName>[TPrefix]
}

export function extractId(id: Id[keyof Id]) {
  const [prefix, connectorName, ...rest] = id.split('_')
  // TODO: Check prefix match predefined prefixes and that connectorName is truthy
  // rest.join shall have a type of string which is actually totally the correct type
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [prefix as IdPrefix, connectorName!, rest.join('_')] as const
}

// TODO: Should we have a branded type for connectorName?
export function extractConnectorName(id: Id['int'] | Id['reso']) {
  return extractId(id)[1]
}

export function swapPrefix<TPrefix extends IdPrefix>(
  id: Id[keyof Id],
  newPrefix: TPrefix,
) {
  const [, connectorName, rest] = extractId(id)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  return makeId<TPrefix, string>(...([newPrefix, connectorName, rest] as any))
}
