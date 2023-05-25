'use client'

import {
  ComboboxDemo,
  CommandBar,
  CommandInline,
  CommandPopover,
} from '@usevenice/ui'

import {GlobalCommandBar} from '@/components/GlobalCommandBar'
import {veniceCommands} from '@/lib-client/venice-commands'

export default function ComingSoonPage() {
  return (
    <div className="p-6">
      <GlobalCommandBar />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Coming soon
      </h2>
      <CommandBar definitions={veniceCommands} />

      <div className="m-5 border p-5">
        <CommandPopover
          definitions={veniceCommands}
          initialParams={{id: 'pipe_123'}}
          hideGroupHeadings
        />
        <ComboboxDemo />
      </div>
      <div className="m-5 border p-5">
        <CommandInline
          hideGroupHeadings
          definitions={veniceCommands}
          initialParams={{id: 'pipe_123'}}
        />
      </div>
    </div>
  )
}
