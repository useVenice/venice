import {useRouter} from 'next/navigation'
import React from 'react'

import type {SchemaSheetRefValue} from '@usevenice/ui'
import {useWithToast} from '@usevenice/ui'

import {PipelineSheet} from '@/components/PipelineSheet'
import type {ZClient} from '@/lib-common/schemas'

import {trpcReact} from '../lib-client/trpcReact'

export function useCommandContext() {
  const trpcCtx = trpcReact.useContext()
  const {withToast} = useWithToast()
  const router = useRouter()

  const [pipelineSheetState, setPipelineSheetState] = React.useState({
    open: false,
    pipeline: undefined as undefined | ZClient['pipeline'],
  })

  return {trpcCtx, withToast, router, pipelineSheetState, setPipelineSheetState}
}

export type CommandContext = ReturnType<typeof useCommandContext>

export function WithCommandContext(props: {
  children: (ctx: CommandContext) => React.ReactNode
}) {
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
      {props.children(ctx)}
    </>
  )
}
