import {R, titleCase, z} from '@usevenice/util'

import type {_infer, CommandDefinitionMap} from './types'

export type PreparedCommand = ReturnType<
  typeof prepareCommands
>['commands'][number]

export function prepareCommands({
  definitions,
}: {
  definitions: CommandDefinitionMap<any>
}) {
  const commands = Object.entries(definitions).map(([key, value]) => {
    const [_group, titleInGroup] = (key.split('/').pop() ?? '').split(':')
    const title = titleInGroup ? [titleInGroup, _group].join(' ') : _group
    const group = titleInGroup ? _group : ''
    const params = value.params ?? z.object({})
    return {
      ...value,
      params,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      hasParams: Object.keys(params.shape).length > 0,
      title: value.title ?? titleCase(title),
      group: titleCase(value.group ?? group),
      key,
    }
  })
  const commandGroups = R.groupBy(commands, (c) => c.group)

  return {commandGroups, commands}
}

export function filterCommands({
  commands: allCommands,
  params,
}: {
  commands: PreparedCommand[]
  params: Record<string, unknown>
}) {
  const hasParams = Object.keys(params).length > 0

  const commands = allCommands.filter((cmd) => {
    // Temp solution for globalCommands
    if (!hasParams && cmd.hasParams) {
      return false
    }
    // Check if every command is valid
    for (const [key, value] of Object.entries(params)) {
      const shape = cmd.params.shape as Record<string, z.ZodTypeAny>
      const paramSchema = shape[key]
      if (!paramSchema) {
        return false
      }
      if (!paramSchema.safeParse(value).success) {
        return false
      }
    }
    return true
  })

  const commandGroups = R.groupBy(commands, (c) => c.group)
  return {commands, commandGroups}
}

export function executeCommand<
  TDef extends CommandDefinitionMap<TCtx>,
  TKey extends keyof TDef,
  TCtx = unknown,
>({
  definitions,
  command: [key, params],
  ctx,
}: {
  definitions: TDef
  command: [key: TKey, params: _infer<TDef[TKey]['params'], {}>]
  ctx: TCtx
}) {
  // Need to deal with commands with dynamic useCommandDef hooks
  return definitions[key]?.execute?.({params, ctx}) as ReturnType<
    NonNullable<TDef[TKey]['execute']>
  >
}
