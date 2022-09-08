import {z} from '@ledger-sync/util'

// Types
// Input type (generic)
// - DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic)

export type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])
