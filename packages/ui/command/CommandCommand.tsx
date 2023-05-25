import {MoreHorizontal} from 'lucide-react'
import React from 'react'

import {R} from '@usevenice/util'

import {Icon} from '../components/Icon'
import {Button, Popover, PopoverContent, PopoverTrigger} from '../shadcn'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '../shadcn/Command'
import {cn} from '../utils'
import {filterCommands, prepareCommands} from './command-fns'
import type {CommandDefinitionMap} from './types'

export interface CommandComponentProps<
  TCtx = any,
  TDefs extends CommandDefinitionMap<TCtx> = CommandDefinitionMap<TCtx>,
> {
  placeholder?: string
  emptyMessage?: string
  definitions: TDefs
  onSelect?: (key: keyof TDefs) => void
  initialParams?: Record<string, unknown>
  hideGroupHeadings?: boolean
}

// TODO: Detect shortcut conflict

function CommandItemContainer({
  command: _cmd,
  onSelect,
  params,
}: {
  command: ReturnType<typeof prepareCommands>['commands'][number]
  params?: Record<string, unknown>
  onSelect?: (value: string) => void
}) {
  const cmd = {..._cmd, ..._cmd.useCommand?.(undefined as never)}
  return (
    <CommandItem
      // Value is used for filtering commands
      // Workaround for https://github.com/pacocoursey/cmdk/issues/140
      value={R.compact([cmd.title, cmd.subtitle, cmd.shortcut]).join(' ')}
      onSelect={(currentValue) => {
        console.log('command selected', currentValue)
        void cmd.execute?.({ctx: {}, params: params ?? {}})
        onSelect?.(currentValue)
      }}>
      {cmd.icon && (
        <Icon
          name={cmd.icon}
          className={cn(
            'mr-2 h-4 w-4 shrink-0',
            cmd.subtitle && 'mt-[2px] self-start',
          )}
        />
      )}
      <div className="flex flex-col gap-1 overflow-hidden">
        <span>{cmd.title}</span>
        {cmd.subtitle && (
          <pre
            title={cmd.subtitle}
            className="overflow-hidden text-ellipsis text-muted-foreground">
            {cmd.subtitle}
          </pre>
        )}
      </div>
      {cmd.shortcut && (
        // Need to render shortcut better... $mod+K => ⌘S
        <CommandShortcut>{cmd.shortcut}</CommandShortcut>
      )}
    </CommandItem>
  )
}

export function CommandContent({
  definitions,
  emptyMessage = 'No commands found.',
  placeholder = 'Search...',
  onSelect,
  initialParams,
  hideGroupHeadings,
}: CommandComponentProps) {
  const {commandGroups} = React.useMemo(() => {
    const prepared = prepareCommands({definitions})
    if (initialParams) {
      return filterCommands({
        commands: prepared.commands,
        params: initialParams,
      })
    }
    return prepared
  }, [definitions, initialParams])

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandEmpty>{emptyMessage}</CommandEmpty>
      <CommandList>
        {Object.entries(commandGroups).map(([groupName, commands]) => (
          <CommandGroup
            key={groupName}
            heading={!hideGroupHeadings && groupName}>
            {commands.map((cmd) => (
              <CommandItemContainer
                key={cmd.key}
                command={cmd}
                onSelect={onSelect}
                params={initialParams}
              />
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  )
}

export function CommandInline(props: CommandComponentProps) {
  return (
    <Command>
      <CommandContent {...props} />
    </Command>
  )
}

export function CommandPopover(props: CommandComponentProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <CommandInline
          {...props}
          onSelect={(key) => {
            setOpen(false)
            props.onSelect?.(key)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export function CommandBar(props: CommandComponentProps) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.metaKey) {
        setOpen((open) => !open)
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="sm:top-32">
      <CommandContent
        {...props}
        onSelect={(key) => {
          setOpen(false)
          props.onSelect?.(key)
        }}
      />
    </CommandDialog>
  )
}
