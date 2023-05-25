'use client'

import {
  ComboboxDemo,
  CommandBar,
  CommandInline,
  CommandPopover,
} from '@usevenice/ui'

import {useCommandContext} from '@/commands/command-context'
import {veniceCommands} from '@/commands/command-definitions'
import {GlobalCommandBar} from '@/components/GlobalCommandBar'

export default function ComingSoonPage() {
  const ctx = useCommandContext()
  return (
    <div className="p-6">
      <GlobalCommandBar />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Coming soon
      </h2>
      <CommandBar ctx={ctx} definitions={veniceCommands} />

      <div className="m-5 border p-5">
        <CommandPopover
          ctx={ctx}
          definitions={veniceCommands}
          initialParams={{id: 'pipe_123'}}
          hideGroupHeadings
        />
        <ComboboxDemo />
      </div>
      <div className="m-5 border p-5">
        <CommandInline
          ctx={ctx}
          hideGroupHeadings
          definitions={veniceCommands}
          initialParams={{id: 'pipe_123'}}
        />
      </div>
    </div>
  )
}
