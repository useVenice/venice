import type {AnyProviderDef, AnySyncProvider} from '@usevenice/cdk-core'
import {makeSyncProvider} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

import type {EntityPayload} from './entity-link-types'
import {zEntityPayload} from './entity-link-types'

// NEXT: add institution, etc.

type _opt<T> = T | undefined

/**
 * TODO: Narrow the type of AnyProviderDef to only those whose `sourceState`
 * and `destinationInputEntity` match the type needed for venice
 */
export const veniceProviderBase = <
  T extends AnyProviderDef,
  TSourceMapEntity extends _opt<
    // Simpler
    | Partial<{
        [k in T['_types']['sourceOutputEntity']['entityName']]: (
          entity: Extract<T['_types']['sourceOutputEntity'], {entityName: k}>,
          settings: T['_types']['connectionSettings'],
        ) => EntityPayload | null
      }>
    // More powerful
    | ((
        entity: T['_types']['sourceOutputEntity'],
        settings: T['_types']['connectionSettings'],
      ) => EntityPayload | null)
  >,
>(
  def: T,
  extension: {sourceMapEntity: TSourceMapEntity},
) => makeSyncProvider({...makeSyncProvider.defaults, def, extension})

veniceProviderBase.def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  sourceState: z
    .object({
      /** Account ids to sync */
      accountIds: z.array(z.string()).nullish(),
      /** Date to sync since */
      sinceDate: z.string().nullish() /** ISO8601 */,
    })
    .default({}),
  // How do we omit destination defs for source only providers and vice versa?
  destinationInputEntity: zEntityPayload,
})

export type VeniceProvider = ReturnType<typeof veniceProviderBase>

export function isVeniceProvider(
  provider: AnySyncProvider,
): provider is VeniceProvider {
  return typeof provider.extension === 'object' && provider.extension
    ? 'sourceMapEntity' in provider.extension
    : false
}
