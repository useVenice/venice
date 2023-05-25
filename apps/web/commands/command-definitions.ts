import {useTheme} from 'next-themes'

import {zId} from '@usevenice/cdk-core'
import type {CommandDefinitionMap} from '@usevenice/ui'
import {cmdInit, useWithToast} from '@usevenice/ui'
import {z} from '@usevenice/util'

import {zClient} from '@/lib-common/schemas'

import {copyToClipboard} from '../lib-client/copyToClipboard'
import type {CommandContext} from './command-context'

const cmd = cmdInit<CommandContext>()

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
  copy_id: cmd.identity({
    icon: 'Copy',
    subtitle: 'reso_plaid_01H17ZDXSQ6JN63SHCXK3FEK3E',
    params: z.object({id: z.string()}),
    // TODO: Add withToast into context so we do not need to useCommand here
    // and the copy_id command can be available everywhere.
    useCommand: (_) => {
      const {withToast} = useWithToast()
      return {
        execute: ({params: {id}}) =>
          withToast(() => copyToClipboard(id), {
            title: 'Copied to clipboard',
          }),
      }
    },
  }),
  'pipeline:edit': cmd.identity({
    icon: 'Pencil',
    params: z.object({pipeline: zClient.pipeline}),
    execute: ({params: {pipeline}, ctx}) => {
      ctx.setPipelineSheetState({pipeline, open: true})
    },
  }),
  'pipeline:create': cmd.identity({
    icon: 'Plus',
    execute: ({ctx}) => {
      ctx.setPipelineSheetState({pipeline: undefined, open: true})
    },
  }),
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

  'resource:edit': {
    icon: 'Pencil',
  },
  'pipeline:sync': {
    icon: 'RefreshCw',
    group: 'pipeline',
  },
  'pipeline:delete': {
    icon: 'Trash',
    params: z.object({
      id: zId('pipe'),
    }),

    execute: () => {},
  },
} satisfies CommandDefinitionMap<CommandContext>
