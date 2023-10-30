import {zStandard} from '@usevenice/cdk-core'
import {R, z} from '@usevenice/util'

import {zEntityName} from './entity-link-types'

// NEXT: add institution, etc.

/** Aka EntityName + resource + institution, See Airbyte docs on streams */
export const zStream = z.enum([
  // TODO: Merge these different references to entity names together in one place...
  ...zEntityName.options,
  ...(R.keys(zStandard) as Array<keyof typeof zStandard>),
])

export interface VeniceSourceState {
  streams?: Array<z.infer<typeof zStream>> | null
}

export function shouldSync(
  state: VeniceSourceState,
  stream: z.infer<typeof zStream>,
) {
  return !state.streams || state.streams.includes(stream) ? true : undefined
}
