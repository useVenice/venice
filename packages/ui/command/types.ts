import type {z} from '@usevenice/util'
import {R, titleCase} from '@usevenice/util'

import type {IconName} from '../components/Icon'

export interface CommandDefinitionInput<
  TCtx = unknown,
  TParams extends z.AnyZodObject = z.AnyZodObject,
> {
  icon?: IconName
  shortcut?: string
  title?: string
  subtitle?: string
  /** CommandGroup.heading */
  group?: string

  params?: TParams
  handler?: (options: {
    params: z.infer<TParams>
    ctx: TCtx
  }) => void | Promise<void>
}

export type CommandDefinitionMap<TCtx = unknown> = Record<
  string,
  CommandDefinitionInput<TCtx>
>

export interface CommandComponentProps<
  TCtx = any,
  TDefs extends CommandDefinitionMap<TCtx> = CommandDefinitionMap<TCtx>,
> {
  placeholder?: string
  emptyMessage?: string
  definitions: TDefs
  onSelect?: (key: keyof TDefs) => void
}

// TODO: Detect shortcut conflicts
export function prepareCommands({
  definitions,
}: {
  definitions: CommandDefinitionMap
}) {
  const commands = Object.entries(definitions).map(([key, value]) => {
    const [_group, titleInGroup] = (key.split('/').pop() ?? '').split(':')
    const title = titleInGroup ? [titleInGroup, _group].join(' ') : _group
    const group = titleInGroup ? _group : ''

    return {
      ...value,
      title: value.title ?? titleCase(title),
      group: titleCase(value.group ?? group),
      key,
    }
  })
  const commandGroups = R.groupBy(commands, (c) => c.group)

  return {commandGroups, commands}
}
