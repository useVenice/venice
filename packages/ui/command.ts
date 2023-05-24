import type {z} from '@usevenice/util'

import type {IconName} from './components/Icon'

export interface CommandDefinitionInput<
  TCtx = unknown,
  TParams extends z.AnyZodObject = z.AnyZodObject,
> {
  icon?: IconName
  shortcut?: string
  title?: string
  /** CommandGroup.heading */
  group?: string

  params?: TParams
  handler: (options: {
    params: z.infer<TParams>
    ctx: TCtx
  }) => void | Promise<void>
}

export type CommandDefinitionMap<TCtx = unknown> = Record<
  string,
  CommandDefinitionInput<TCtx>
>

export interface CommandBarOptions<TCtx = unknown> {
  placeholder?: string
  emptyMessage?: string
  definitions: CommandDefinitionMap<TCtx>
}
