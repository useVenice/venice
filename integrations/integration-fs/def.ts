import type {
  AnyEntityPayload,
  IntegrationDef,
  IntegrationSchemas,
} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import {z, zCast} from '@usevenice/util'

// MARK: - Source Sync

export const zWatchPathsInput = z.object({
  basePath: z.string(),
  paths: z.array(z.string()).optional(),
})

export const fsSchemas = {
  name: z.literal('fs'),
  resourceSettings: zWatchPathsInput.pick({basePath: true}),
  /**
   * `paths` only used for sourceSync, not destSync. Though these are not technically states...
   * And they are not safe to just erase if fullSync = true.
   * TODO: Introduce a separate sourceOptions / destinationOptions type later when it becomes an
   * actual problem... for now this issue only impacts FirebaseProvider and FSProvider
   * which are not actually being used as top level providers
   */
  sourceState: zWatchPathsInput.pick({paths: true}),
  sourceOutputEntity: zCast<AnyEntityPayload>(),
  destinationInputEntity: zCast<AnyEntityPayload>(),
} satisfies IntegrationSchemas

export const fsHelpers = intHelpers(fsSchemas)

export const fsDef = {
  name: 'fs',
  metadata: {
    platforms: ['local'],
    displayName: 'File system',
    categories: ['flat-files-and-spreadsheets'],
  },

  def: fsSchemas,
} satisfies IntegrationDef<typeof fsSchemas>

export default fsDef
