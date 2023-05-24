'use client'

import {
  ComboboxDemo,
  CommandBar,
  CommandInline,
  CommandPopover,
} from '@usevenice/ui'

import {commands} from '@/lib-client/commands'

export default function ComingSoonPage() {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Coming soon
      </h2>
      <CommandBar definitions={commands} />

      <div className="m-5 border p-5">
        <CommandPopover definitions={commands} />
        <ComboboxDemo />
      </div>
      <div className="m-5 border p-5">
        <CommandInline definitions={commands} />
      </div>
    </div>
  )
}
