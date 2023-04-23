import {z, zJsonObject} from '@usevenice/util'

import {zEndUserId, zId, zUserId} from './id.types'

// Utility types

// Types
// Input type (generic, nested)
// - Normlaized, DB type conforms to input type (not generic, possibly generated)
// Output type (parsed, generic, nested)

export type EnvName = z.infer<typeof zEnvName>
export const zEnvName = z.enum(['sandbox', 'development', 'production'])

// MARK: - Standard types

export const zInstitutionCategory = z.enum([
  'accounting',
  'banking',
  'hris', // Aka payroll
])

export type ZStandard = {
  [k in keyof typeof zStandard]: z.infer<(typeof zStandard)[k]>
}
export const zStandard = {
  /** Should this be renamed to `UpstreamProvider` instead? */
  institution: z.object({
    id: zId('ins'),
    name: z.string(),
    // No http prefix preprocessing for logo url as they can be data urls
    logoUrl: z.string().url().optional(),
    loginUrl: z.preprocess(
      // Sometimes url get returned without http prefix...
      // Is there a way to "catch" invalid url error then retry with prefix?
      // Would be better than just prefixing semi-blindly.
      (url) =>
        typeof url === 'string' && !url.toLowerCase().startsWith('http')
          ? `https://${url}`
          : url,
      z.string().url().optional(),
    ),
    categories: z.array(zInstitutionCategory).nullish(),
    /** Environment specific providers */
    envName: zEnvName.optional(),
  }),
  resource: z.object({
    id: zId('reso'),
    displayName: z.string(),
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
    labels: z.array(z.string()).optional(),
  }),
}

// TODO: Make the Input types compatible with our raw types...

// MARK: - Raw types

export type ZRaw = {
  [k in keyof typeof zRaw]: z.infer<(typeof zRaw)[k]>
}
/** Should this be a factory function so we can use typed config / settings? */
export const zRaw = {
  workspace: z.object({
    id: zId('ws'),
    slug: z.string(),
    name: z.string(),
  }),
  workspaceMember: z.object({
    workspaceId: zId('ws'),
    userId: zUserId,
  }),
  integration: z.object({
    id: zId('int'),
    config: zJsonObject.nullish(),
  }),
  resource: z.object({
    id: zId('reso'),
    endUserId: zEndUserId.nullish(),
    integrationId: zId('int').nullish(),
    institutionId: zId('ins').nullish(),
    settings: zJsonObject.nullish(),
    // TODO: Does envName belong in Raw layer or Standard layer?
    /** Development env often allows connection to production institutions */
    envName: zEnvName.nullish(),
    standard: zStandard.resource.omit({id: true}).nullish(),
    displayName: z.string().nullish(),
  }),
  pipeline: z.object({
    id: zId('pipe'),
    sourceId: zId('reso').nullish(),
    sourceState: zJsonObject.nullish(),
    destinationId: zId('reso').nullish(),
    destinationState: zJsonObject.nullish(),
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
