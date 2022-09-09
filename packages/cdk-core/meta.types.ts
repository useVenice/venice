import {z} from '@ledger-sync/util'

import {zId} from './id.types'

// Utility types
type JsonLiteral = boolean | null | number | string
type Json = JsonLiteral | {[key: string]: Json} | Json[]
const zJsonLiteral = z.union([z.string(), z.number(), z.boolean(), z.null()])
const zJson: z.ZodSchema<Json> = z.lazy(() =>
  z.union([zJsonLiteral, z.array(zJson), z.record(zJson)]),
)
const zJsonObject = z.record(zJson)

// Types
// Input type (generic, nested)
// - Normlaized, DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic, nested)

export type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])

export const zStandard = {
  institution: z.object({
    id: zId('ins'),
    name: z.string(),
    logoUrl: z.string().url().optional(),
    loginUrl: z.string().url().optional(),
    /** Environment specific providers */
    envName: zEnvName.optional(),
  }),
  connection: z.object({
    id: zId('conn'),
    displayName: z.string(),
    institutionId: zId('ins'),
    // institution: zStandard.instution.optional(),
    /**
     * This correspond to the connection status.
     * Pipeline shall have a separate syncStatus */
    status: z
      .enum([
        'healthy', // Connected and all is well
        'disconnected', // User intervention needed to reconnect
        'error', // System error, nothing user can do. This would also include revoked
        'manual', // This is a manual connection (e.g. import. So normal status does not apply)
      ])
      .nullish(), // Status unknown
    statusMessage: z.string().nullish(),
  }),
}

// TODO: Make the Input types compatible with our raw types...
export const zMeta = {
  integration: z.object({
    id: zId('int'),
    config: zJsonObject.optional(),
  }),
  connection: z.object({
    id: zId('conn'),
    ledgerId: zId('ldgr').optional(),
    integrationId: zId('int').optional(),
    settings: zJsonObject.optional(),
    standard: zStandard.connection.omit({id: true}),
  }),
  pipeline: z.object({
    id: zId('pipe'),
    ledgerId: zId('ldgr').optional(),
    sourceId: zId('conn').optional(),
    sourceOptions: zJsonObject.optional(),
    destinationId: zId('conn').optional(),
    destinationOptions: zJsonObject.optional(),
  }),
  institution: z.object({
    id: zId('ins'),
    standard: zStandard.institution.omit({id: true}),
    external: zJsonObject,
  }),
}

// const test = `
// {
//   pipeline {
//     id
//     source {
//       id
//       integration {
//         id
//         provider {
//           name
//         }
//       }
//       institution {
//         id
//       }
//     }
//     sourceOptions

//     destination {
//       id
//       integration {
//         id
//         provider {
//           name
//         }
//       }
//       institution {
//         id
//       }
//     }
//     destinationOptions
//   }
// }
// `
