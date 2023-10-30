import {z, zJsonObject} from '@usevenice/util'

import {zEndUserId, zId} from './id.types'

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
// TODO: Consider auto-generating this from database, via a tool such as zapetos, pgtyped
// or prisma, though would need to allow us to override for things like id prefix as well
// as more specific type than just jsonb

const zBase = z.object({
  createdAt: z.date(), // should be string but slonik returns date
  updatedAt: z.date(), // should be string but slonik returns date
})
export const zRaw = {
  integration: zBase.extend({
    id: zId('int'),
    /** This is a generated column, which is not the most flexible. Maybe we need some kind of mapStandardIntegration method? */
    envName: z.string().nullish(),
    providerName: z.string(),
    config: zJsonObject.nullish(),
    endUserAccess: z
      .boolean()
      .nullish()
      .describe(
        "Allow end user to create resources using this integration's configuration",
      ),
    orgId: zId('org'),
    displayName: z.string().nullish(),
  }),
  resource: zBase.extend({
    id: zId('reso'),
    providerName: z.string(),
    displayName: z.string().nullish(),
    endUserId: zEndUserId.nullish(),
    integrationId: zId('int'),
    institutionId: zId('ins').nullish(),
    settings: zJsonObject.nullish(),
    standard: zStandard.resource.omit({id: true}).nullish(),
  }),
  pipeline: zBase.extend({
    id: zId('pipe'),
    // TODO: Remove nullish now that pipelines are more fixed
    sourceId: zId('reso').optional(),
    sourceState: zJsonObject.optional(),
    destinationId: zId('reso').optional(),
    destinationState: zJsonObject.optional(),
    linkOptions: z
      .array(z.unknown())
      // z.union([
      //   z.string(),
      //   z.tuple([z.string()]),
      //   z.tuple([z.string(), z.unknown()]),
      // ]),
      .nullish(),
    // TODO: Add two separate tables sync_jobs to keep track of this instead of these two
    // though questionnable whether it should be in a separate database completely
    // just like Airbyte. Or perhaps using airbyte itself as the jobs database
    lastSyncStartedAt: z.date().nullish(),
    lastSyncCompletedAt: z.date().nullish(),
  }),
  institution: zBase.extend({
    id: zId('ins'),
    providerName: z.string(),
    standard: zStandard.institution.omit({id: true}).nullish(),
    external: zJsonObject.nullish(),
  }),
  // TODO: Add connection_attempts
}
