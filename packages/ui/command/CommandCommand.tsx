import {MoreHorizontal} from 'lucide-react'
import React from 'react'

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
import type {CommandComponentProps} from './types'
import {prepareCommands} from './types'

export function CommandContent({
  definitions,
  emptyMessage = 'No commands found.',
  placeholder = 'Search...',
}: CommandComponentProps) {
  const {commandGroups} = React.useMemo(
    () => prepareCommands({definitions}),
    [definitions],
  )

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandEmpty>{emptyMessage}</CommandEmpty>
      <CommandList>
        {Object.entries(commandGroups).map(([groupName, commands]) => (
          <CommandGroup key={groupName} heading={groupName}>
            {commands.map((cmd) => (
              <CommandItem
                key={cmd.key}
                onSelect={(currentValue) => {
                  console.log('command selected', currentValue)
                  // cmd.handler(currentValue)
                  // setValue(currentValue === value ? '' : currentValue)
                  // setOpen(false)
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
        <CommandInline {...props} />
      </PopoverContent>
    </Popover>
  )
}

export function CommandBar(props: CommandComponentProps) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="sm:top-32">
      <CommandContent {...props} />
    </CommandDialog>
  )
}
