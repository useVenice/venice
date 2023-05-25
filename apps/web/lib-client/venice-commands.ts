import {useTheme} from 'next-themes'

import {zId} from '@usevenice/cdk-core'
import type {CommandDefinitionMap} from '@usevenice/ui'
import {z} from '@usevenice/util'

export interface CommandContext {
  activeEntity: {__typename: string; id: string}
}

export const veniceCommands = {
  go_home: {
    icon: 'Home',
  },
  go_to_settings: {
    icon: 'Settings',
  },
  toggle_dark_mode: {
    // TODO: Give the choice of dark / light / system via an enum somehoe
    // as right now the there are no easy ways to "reset"
    useCommand: () => {
      const {setTheme, resolvedTheme, theme} = useTheme()
      return {
        icon:
          theme === 'dark'
            ? 'SunMedium'
            : theme === 'light'
            ? 'Moon'
            : 'Laptop',
        execute: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
      }
    },
  },
  copy_id: {
    icon: 'Copy',
    subtitle: 'reso_plaid_01H17ZDXSQ6JN63SHCXK3FEK3E',
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
    params: z.object({
      pipeline: zId('pipe'),
      // .openapi('pipeline'),
    }),
    // .openapi('delete_pipeline_params'),
    execute: () => {},
  },
} satisfies CommandDefinitionMap<CommandContext>
