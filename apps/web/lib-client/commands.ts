import {zId} from '@usevenice/cdk-core'
import type {CommandDefinitionMap} from '@usevenice/ui'
import {z} from '@usevenice/util'

export interface CommandContext {
  activeEntity: {__typename: string; id: string}
}

export const commands = {
  go_home: {
    icon: 'Home',
  },
  go_to_settings: {
    icon: 'Settings',
  },
  copy_id: {
    icon: 'Copy',
  },

  'resource:edit': {
    icon: 'Pencil',
  },
  'resource:delete': {
    icon: 'Trash',
  },
  'resource:sync': {
    icon: 'RefreshCw',
  },
  'postgres/run_sql': {
    icon: 'Database',
    group: 'resource',
    // Only show me for postgres resources
  },
  'plaid/simulate_disconnect': {
    icon: 'Unlink',
    group: 'resource',
    // Only show me for sandbox plaid resources
  },

  'pipeline:edit': {
    icon: 'Pencil',
  },
  'pipeline:sync': {
    icon: 'RefreshCw',
    group: 'pipeline',
  },
  'pipeline:delete': {
    icon: 'Trash',
    params: z
      .object({
        pipeline: zId('pipe').openapi('pipeline'),
      })
      .openapi('delete_pipeline_params'),
    handler: ({ctx}) => {},
  },
} satisfies CommandDefinitionMap<CommandContext>
