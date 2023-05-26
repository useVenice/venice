import {useTheme} from 'next-themes'

import type {CommandDefinitionMap} from '@usevenice/ui'
import {cmdInit} from '@usevenice/ui'
import {delay, z} from '@usevenice/util'

import {__DEBUG__} from '@/../app-config/constants'
import {zClient} from '@/lib-common/schemas'

import {copyToClipboard} from '../lib-client/copyToClipboard'
import type {CommandContext} from './vcommand-context'

const cmd = cmdInit<CommandContext>()

export const pipelineCommands = {
  'pipeline:create': cmd.identity({
    icon: 'Plus',
    execute: ({ctx}) =>
      ctx.setPipelineSheetState({pipeline: undefined, open: true}),
  }),
  'pipeline:edit': cmd.identity({
    icon: 'Pencil',
    params: z.object({pipeline: zClient.pipeline}),
    execute: ({params: {pipeline}, ctx}) => {
      ctx.setPipelineSheetState({pipeline, open: true})
    },
  }),
  'pipeline:sync': cmd.identity({
    icon: 'RefreshCw',
    group: 'pipeline',
    params: z.object({pipeline: zClient.pipeline}),
    execute: ({params: {pipeline}, ctx}) => {
      void ctx.withToast(() =>
        ctx.trpcCtx.client.syncPipeline.mutate([pipeline.id, {}]),
      )
    },
  }),
  'pipeline:delete': {
    icon: 'Trash',
    params: z.object({pipeline: zClient.pipeline}),
    execute: () => {},
  },
} satisfies CommandDefinitionMap<CommandContext>

export const resourceCommands = {
  'resource:edit': {
    icon: 'Pencil',
    params: z.object({resource: zClient.resource}),
  },
  'resource:delete': {
    icon: 'Trash',
    params: z.object({resource: zClient.resource}),
  },
  'resource:sync': {
    icon: 'RefreshCw',
    params: z.object({resource: zClient.resource}),
  },
  'postgres/run_sql': {
    icon: 'Database',
    group: 'resource',
    params: z.object({resource: zClient.resource}),
    // Only show me for postgres resources
  },
  'plaid/simulate_disconnect': {
    icon: 'Unlink',
    group: 'resource',
    params: z.object({resource: zClient.resource}),
    // Only show me for sandbox plaid resources
  },
} satisfies CommandDefinitionMap<CommandContext>

/** Generic command that should apply to ANY entity... */
export const entityCommands = {
  copy_id: cmd.identity({
    icon: 'Copy',
    params: z.object({pipeline: z.object({id: z.string()})}),
    useCommand: (initial) => ({
      subtitle: initial.pipeline?.id,
      execute: ({params, ctx}) =>
        ctx.withToast(() => copyToClipboard(params.pipeline.id), {
          title: 'Copied to clipboard',
        }),
    }),
  }),
} satisfies CommandDefinitionMap<CommandContext>

export const debugCommands = {
  test_toast: {
    execute: ({ctx}) => {
      void ctx.withToast(() => delay(1000).then(() => 'done'), {
        title: 'Hello world',
      })
    },
  },
  test_cmd: {
    execute: () => console.log('noop'),
  },
} satisfies CommandDefinitionMap<CommandContext>

export const vDefinitions = {
  ...pipelineCommands,
  ...resourceCommands,
  ...entityCommands,
  ...(__DEBUG__ && debugCommands),
  // TODO: Dedupe with the links from the navigation sidebar
  go_to_home: {
    icon: 'Home',
    execute: ({ctx}) => ctx.router.push('/'),
  },
  go_to_settings: {
    icon: 'Settings',
    execute: ({ctx}) => ctx.router.push('/settings'),
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
} satisfies CommandDefinitionMap<CommandContext>
