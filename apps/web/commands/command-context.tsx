import {useRouter} from 'next/navigation'
import React from 'react'

import {useWithToast} from '@usevenice/ui'

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
