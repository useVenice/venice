import React from 'react'

import type {CommandComponentProps, SchemaSheetRefValue} from '@usevenice/ui'
import {CommandPopover} from '@usevenice/ui'

import {PipelineSheet} from '@/app/(admin)/(authenticated)/pipelines/page'

import {useCommandContext} from './command-context'
import {veniceCommands} from './command-definitions'

export function CommandMenu(
  props: Pick<CommandComponentProps, 'initialParams'>,
) {
  const _ctx = useCommandContext()
  const ref = React.useRef<SchemaSheetRefValue>(null)

  const ctx = React.useMemo(
    () =>
      ({
        ..._ctx,
        // Hack around not being able to pass open/setOpen to pipeline sheet yet
        setPipelineSheetState: (newState) => {
          if (typeof newState === 'object') {
            ref.current?.setOpen(newState.open)
          }
          _ctx.setPipelineSheetState(newState)
        },
      } satisfies typeof _ctx),
    [_ctx],
  )
  return (
    <>
      <PipelineSheet
        ref={ref}
        triggerButton={false}
        pipeline={ctx.pipelineSheetState.pipeline}
      />
      <CommandPopover
        {...props}
        ctx={ctx}
        definitions={veniceCommands}
        hideGroupHeadings
      />
    </>
  )
}
