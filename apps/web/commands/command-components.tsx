import type {
  ButtonProps,
  CommandComponentProps,
  CommandDraft,
} from '@usevenice/ui'
import {CommandBar, CommandButton, CommandPopover} from '@usevenice/ui'

import type {CommandContext} from './command-context'
import {WithCommandContext} from './command-context'
import {veniceCommands} from './command-definitions'

export function VCommandMenu(
  props: Pick<CommandComponentProps, 'initialParams'>,
) {
  return (
    <WithCommandContext>
      {(ctx) => (
        <CommandPopover
          {...props}
          ctx={ctx}
          definitions={veniceCommands}
          hideGroupHeadings
        />
      )}
    </WithCommandContext>
  )
}

export function VCommandBar() {
  return (
    <WithCommandContext>
      {(ctx) => (
        <CommandBar ctx={ctx} definitions={veniceCommands} hideGroupHeadings />
      )}
    </WithCommandContext>
  )
}

export function VCommandButton<TKey extends keyof typeof veniceCommands>(
  props: ButtonProps & {
    command: CommandDraft<typeof veniceCommands, TKey, CommandContext>
  },
) {
  return (
    <WithCommandContext>
      {(ctx) => (
        <CommandButton {...props} ctx={ctx} definitions={veniceCommands} />
      )}
    </WithCommandContext>
  )
}

// TODO: Add VCommandButton
