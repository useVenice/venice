import {makePrefixedId, z} from '@ledger-sync/util'

export type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])

export type ConnId<TName extends string = string> = `conn_${TName}_${string}`
export type IntId<TName extends string = string> = `int_${TName}_${string}`
export type InsId<TName extends string = string> = `ins_${TName}_${string}`
export type PipeId = `pipe_${string}`

export const CORE_NAME_TO_PREFIX = {
  integration: 'int',
  connection: 'conn',
  pipeline: 'pipe',
  institution: 'ins',
} as const

export type Prefix =
  typeof CORE_NAME_TO_PREFIX[keyof typeof CORE_NAME_TO_PREFIX]

export function makeCoreId<TPrefix extends Prefix, TPName extends string>(
  prefix: TPrefix,
  providerName: TPName,
  externalId: string,
) {
  return makePrefixedId(prefix, providerName, externalId)
}

export function zId<TPrefix extends Prefix>(prefix: TPrefix) {
  return z
    .string()
    .refine(
      (s): s is `${TPrefix}_${string}` => s.startsWith(`${prefix}_`),
      `Not a valid ${prefix} id`,
    )
}

// Types
// Input type (generic)
// - DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic)
