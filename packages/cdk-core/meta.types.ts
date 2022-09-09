import {z, zJsonObject} from '@ledger-sync/util'

import {zId} from './id.types'

// Utility types

// Types
// Input type (generic, nested)
// - Normlaized, DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic, nested)

export type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])

// MARK: - Standard types

export type ZStandard = {
  [k in keyof typeof zStandard]: z.infer<typeof zStandard[k]>
}
export const zStandard = {
  /** Should this be renamed to `UpstreamProvider` instead? */
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

// MARK: - Raw types

export type ZRaw = {
  [k in keyof typeof zRaw]: z.infer<typeof zRaw[k]>
}
export const zRaw = {
  integration: z.object({
    id: zId('int'),
    config: zJsonObject.optional(),
  }),
  connection: z.object({
    id: zId('conn'),
    ledgerId: zId('ldgr').optional(),
    integrationId: zId('int').optional(),
    institutionId: zId('ins').optional(),
    settings: zJsonObject.optional(),
    // TODO: Does envName belong in Raw layer or Standard layer?
    /** Development env often allows connection to production institutions */
    envName: zEnvName.optional(),
    standard: zStandard.connection.omit({id: true}),
  }),
  pipeline: z.object({
    id: zId('pipe'),
    ledgerId: zId('ldgr').optional(),
    sourceId: zId('conn').optional(),
    sourceOptions: zJsonObject.optional(),
    destinationId: zId('conn').optional(),
    destinationOptions: zJsonObject.optional(),
    links: z
      .array(z.union([z.string(), z.tuple([z.string(), z.unknown()])]))
      .nullish(),
  }),
  institution: z.object({
    id: zId('ins'),
    standard: zStandard.institution.omit({id: true}),
    external: zJsonObject,
  }),
}
