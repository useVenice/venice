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
/** Should this be a factory function so we can use typed config / settings? */
export const zRaw = {
  integration: z.object({
    id: zId('int'),
    config: zJsonObject.nullish(),
  }),
  connection: z.object({
    id: zId('conn'),
    ledgerId: zId('ldgr').nullish(),
    integrationId: zId('int').nullish(),
    institutionId: zId('ins').nullish(),
    settings: zJsonObject.nullish(),
    // TODO: Does envName belong in Raw layer or Standard layer?
    /** Development env often allows connection to production institutions */
    envName: zEnvName.nullish(),
    standard: zStandard.connection.omit({id: true}).nullish(),
  }),
  pipeline: z.object({
    id: zId('pipe'),
    sourceId: zId('conn').nullish(),
    sourceOptions: zJsonObject.nullish(),
    destinationId: zId('conn').nullish(),
    destinationOptions: zJsonObject.nullish(),
    linkOptions: z
      .array(
        z.union([
          z.string(),
          z.tuple([z.string()]),
          z.tuple([z.string(), z.unknown()]),
        ]),
      )
      .nullish(),
    // TODO: Add two separate tables sync_jobs to keep track of this instead of these two
    // though questionnable whether it should be in a separate database completely
    // just like Airbyte. Or perhaps using airbyte itself as the jobs database
    lastSyncStartedAt: z.date().nullish(),
    lastSyncCompletedAt: z.date().nullish(),
  }),
  institution: z.object({
    id: zId('ins'),
    standard: zStandard.institution.omit({id: true}).nullish(),
    external: zJsonObject.nullish(),
  }),
  // TODO: Add connection_attempts
}
