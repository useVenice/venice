import {makePrefixedId, nonEmpty, objectKeys, R, z} from '@alka/util'

const STANDARD_NAME_TO_PREFIX = {
  account: 'acct',
  transaction: 'txn',
  commodity: 'comm',
  connection: 'conn',
  integration: 'int',
  ledger: 'ldgr',
} as const

export type StandardEntityPrefix = z.infer<typeof zStandardEntityPrefix>
export const zStandardEntityPrefix = z.enum(
  nonEmpty(R.values(STANDARD_NAME_TO_PREFIX)),
)

export type StandardEntityName = z.infer<typeof zStandardEntityName>
export const zStandardEntityName = z.enum(
  nonEmpty(objectKeys(STANDARD_NAME_TO_PREFIX)),
)

export const zStandardEntityPrefixFromName = zStandardEntityName.transform(
  (name) => STANDARD_NAME_TO_PREFIX[name],
)

export function makeStandardId<T extends string>(
  prefix: StandardEntityPrefix,
  providerName: T,
  externalId: string,
) {
  return makePrefixedId(prefix, providerName, externalId)
}
