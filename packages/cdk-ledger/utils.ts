import {nonEmpty, objectKeys, R, z} from '@usevenice/util'

// TODO: Merge this into cdk-core for ease of use...

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

export function makeStandardId<
  T extends string,
  P extends StandardEntityPrefix,
>(prefix: P, providerName: T, externalId: string) {
  return `${prefix}_${providerName}_${externalId}` as const
}

export function splitStandardId(id: string) {
  const [prefix, providerName, ...rest] = id.split('_')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [prefix!, providerName!, rest.join('_')] as const
}
